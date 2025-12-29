import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login-body.dto';

import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { BusinessCacheRepository } from '../redis/business-cache.repository';
import { SendEmailService } from '../send-email/sendEmail.service';
import { UserRole } from '../../shared/enums/user.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private businessCacheRepository: BusinessCacheRepository,
    private jwtService: JwtService,
    private sendEmailService: SendEmailService,
    private configService: ConfigService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(data: RegisterDto) {
    const findUserEmail = await this.userRepository.findOne({
      where: { email: data.email, role: UserRole.USER },
    });
    if (findUserEmail) {
      throw new ConflictException('Email đã tồn tại');
    }

    const findUserPhone = await this.userRepository.findOne({
      where: { phone: data.phone },
    });
    if (findUserPhone) {
      throw new ConflictException('Số điện thoại đã tồn tại');
    }

    const findUserInRedis = await this.businessCacheRepository.getRegisterData(
      data.email,
    );
    if (findUserInRedis) {
      const otpCountdownFind =
        await this.businessCacheRepository.getOtpCountdown(data.email);
      if (otpCountdownFind && Number(otpCountdownFind) > 0) {
        throw new BadRequestException(
          `Bạn đã gửi OTP quá nhanh, vui lòng chờ ${otpCountdownFind} giây để gửi lại`,
        );
      } else {
        throw new ConflictException('Email này đã đăng ký');
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const redisData = {
      email: data.email,
      phone: data.phone,
      fullName: data.fullName,
      password: hashedPassword,
      role: UserRole.USER,
    };
    await this.businessCacheRepository.saveOtp(data.email, otp);
    await this.businessCacheRepository.saveRegisterData(data.email, redisData);
    await this.sendEmailService.sendMailRegisterOtp(
      data.email,
      `Chào mừng: OTP xác thực tài khoản ${data.email}`,
      otp,
      this.configService.get<string>('NODE_ENV', 'prod'),
    );

    return 'Đăng ký thành công, vui lòng kiểm tra email để lấy xác thực OTP';
  }

  async resendRegisterOtp(email: string) {
    const otpFind = await this.businessCacheRepository.getOtp(email);

    if (!otpFind) {
      throw new BadRequestException('Bạn chưa gửi OTP');
    }

    const otpCountdownFind =
      await this.businessCacheRepository.getOtpCountdown(email);
    if (otpCountdownFind && Number(otpCountdownFind) > 0) {
      throw new BadRequestException(
        `Bạn đã gửi OTP quá nhanh, vui lòng chờ ${otpCountdownFind} giây để gửi lại`,
      );
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.businessCacheRepository.saveOtp(email, newOtp);

    await this.sendEmailService.sendMailRegisterOtp(
      email,
      `Chào mừng: OTP xác thực tài khoản ${email}`,
      newOtp,
      this.configService.get<string>('NODE_ENV', 'prod'),
    );
    return 'OTP đã được gửi lại';
  }

  async verifyOtp(email: string, otp: string) {
    const otpFind = await this.businessCacheRepository.getOtp(email);
    if (!otpFind) {
      throw new BadRequestException('OTP không hợp lệ');
    }

    if (otpFind !== otp) {
      throw new BadRequestException('OTP không hợp lệ');
    }

    const registerData =
      await this.businessCacheRepository.getRegisterData(email);
    if (!registerData) {
      throw new BadRequestException('Email này chưa đăng ký');
    }

    const registerDataJson = JSON.parse(registerData as string);

    const findUserPhone = await this.userRepository.findOne({
      where: { phone: registerDataJson.phone },
    });
    if (findUserPhone) {
      await this.businessCacheRepository.deleteOtpRegisterData(email);
      throw new ConflictException('Số điện thoại đã tồn tại');
    }

    // Map sang entity hiện tại: dùng `name` và role mặc định là USER
    const newUser = this.userRepository.create({
      name: registerDataJson.fullName,
      email: registerDataJson.email,
      password: registerDataJson.password,
      phone: registerDataJson.phone,
      role: UserRole.USER,
      tokenVersion: 1,
    });
    const savedUser = await this.userRepository.save(newUser);

    // Cache
    await this.businessCacheRepository.cacheTokenVersion(
      String(savedUser.id),
      savedUser.tokenVersion,
    );

    await this.businessCacheRepository.deleteOtpRegisterData(email);

    return 'Tạo tài khoản thành công';
  }

  private async loginByRole(dto: LoginDto, role: UserRole) {
    const findUser = await this.userRepository.findOne({
      where: { email: dto.email, role },
    });

    if (!findUser) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isdValid = await bcrypt.compare(dto.password, findUser.password);

    if (!isdValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    let tokenVersionToUse: number;
    const cached = await this.businessCacheRepository.getTokenVersion(
      String(findUser.id),
    );
    if (cached) {
      tokenVersionToUse = Number(cached);
    } else {
      tokenVersionToUse = findUser.tokenVersion;
      await this.businessCacheRepository.cacheTokenVersion(
        String(findUser.id),
        tokenVersionToUse,
      );
    }

    const payload = {
      id: findUser.id,
      tokenVersion: tokenVersionToUse,
      role: findUser.role,
    };
    const accessSecret = this.configService.get<string>('JWT_ACCESS_KEY');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_KEY');

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: String(findUser.id),
        role: findUser.role,
        email: findUser.email,
        avatarUrl: findUser.avatarUrl,
        fullName: findUser.name,
      },
    };
  }

  // Đăng nhập cho user (người dùng đặt sân)
  async login(dto: LoginDto) {
    return this.loginByRole(dto, UserRole.USER);
  }

  // Đăng nhập cho chủ sân
  async loginOwner(dto: LoginDto) {
    return this.loginByRole(dto, UserRole.OWNER);
  }

  // Đăng nhập cho super admin
  async loginSuperAdmin(dto: LoginDto) {
    return this.loginByRole(dto, UserRole.SUPER_ADMIN);
  }

  async logout(refreshToken: string) {
    let userJwt: any;

    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_KEY');

      userJwt = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
      const cachedTokenVersion =
        await this.businessCacheRepository.getTokenVersion(String(userJwt.id));
      if (userJwt.tokenVersion !== Number(cachedTokenVersion)) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const findUser = await this.userRepository.findOne({
        where: { id: userJwt.id },
      });
      if (!findUser) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      findUser.tokenVersion++;
      await this.userRepository.save(findUser);

      //Cache
      await this.businessCacheRepository.cacheTokenVersion(
        String(findUser.id),
        findUser.tokenVersion,
      );

      return 'Đăng xuất thành công';
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  async refresh_token(oldRefreshToken: string) {
    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_KEY');

      const userJwt = this.jwtService.verify(oldRefreshToken, {
        secret: refreshSecret,
      });

      let cachedTokenVersion =
        await this.businessCacheRepository.getTokenVersion(String(userJwt.id));

      if (!cachedTokenVersion) {
        const userDb = await this.userRepository.findOne({
          where: { id: userJwt.id },
        });
        if (!userDb) {
          throw new UnauthorizedException('Refresh token không hợp lệ');
        }
        cachedTokenVersion = userDb.tokenVersion.toString();
        await this.businessCacheRepository.cacheTokenVersion(
          String(userJwt.id),
          userDb.tokenVersion,
        );
      }

      if (userJwt.tokenVersion !== Number(cachedTokenVersion)) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const payload = {
        id: userJwt.id,
        tokenVersion: userJwt.tokenVersion,
        role: userJwt.role,
        ...(userJwt.mustChangePassword !== undefined && {
          mustChangePassword: userJwt.mustChangePassword,
        }),
      };

      const accessSecret =
        this.configService.get<string>('JWT_ACCESS_KEY') || 'dev_access_secret';
      const refreshSecretNew =
        this.configService.get<string>('JWT_REFRESH_KEY') ||
        'dev_refresh_secret';

      const accessToken = this.jwtService.sign(payload, {
        secret: accessSecret,
        expiresIn: '1h',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: refreshSecretNew,
        expiresIn: '7d',
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  async changePassword(userId: number | string, dto: ChangePasswordDto) {
    const numericId = Number(userId);
    const findUser = await this.userRepository.findOne({
      where: { id: numericId },
    });
    if (!findUser) {
      throw new NotFoundException('User không tồn tại');
    }

    const checkOldPassword = await bcrypt.compare(
      dto.oldPassword,
      findUser.password,
    );
    if (!checkOldPassword) {
      throw new UnauthorizedException('Mật khẩu cũ không chính xác');
    }

    const newPasswordHashed = await bcrypt.hash(dto.newPassword, 10);

    findUser.password = newPasswordHashed;
    findUser.tokenVersion++;
    await this.userRepository.save(findUser);

    //Cache
    await this.businessCacheRepository.cacheTokenVersion(
      String(findUser.id),
      findUser.tokenVersion,
    );

    return 'Đổi mật khẩu thành công';
  }

  async forgotPassword(email: string, role: string) {
    // role phải nằm trong enum UserRole
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException('Role không hợp lệ');
    }

    const findUser = await this.userRepository.findOne({
      where: { email: email, role: role as UserRole },
    });
    if (!findUser) {
      throw new BadRequestException('Email không tồn tại');
    }

    const otpCountdown =
      await this.businessCacheRepository.getOtpCountdown(email);
    if (otpCountdown && Number(otpCountdown) > 0) {
      throw new BadRequestException(
        `Bạn đã gửi OTP quá nhanh, vui lòng chờ ${otpCountdown} giây để gửi lại`,
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.businessCacheRepository.saveOtpForgotPassword(email, role, otp);

    await this.sendEmailService.sendMailForgotPasswordOtp(
      email,
      `OTP quên mật khẩu ${email} - ${role}`,
      otp,
      this.configService.get<string>('NODE_ENV', 'prod'),
    );

    return 'OTP quên mật khẩu đã được gửi đến email của bạn';
  }

  async verifyForgotPassword(
    email: string,
    role: string,
    otp: string,
    newPassword: string,
  ) {
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException('Role không hợp lệ');
    }

    const otpFind = await this.businessCacheRepository.getOtpForgotPassword(
      email,
      role,
    );

    if (!otpFind) {
      throw new BadRequestException('OTP không hợp lệ');
    }
    if (otpFind !== otp) {
      throw new BadRequestException('OTP không hợp lệ');
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);
    const findUser = await this.userRepository.findOne({
      where: { email: email, role: role as UserRole },
    });
    if (!findUser) {
      throw new NotFoundException('User không tồn tại');
    }
    findUser.password = newPasswordHashed;
    findUser.tokenVersion++;
    await this.userRepository.save(findUser);

    // Cache
    await this.businessCacheRepository.cacheTokenVersion(
      String(findUser.id),
      findUser.tokenVersion,
    );
    await this.businessCacheRepository.deleteOtpForgotPassword(email, role);

    return 'Mật khẩu đã được thay đổi thành công';
  }
}
