import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/shared/enums/user.enum';
import { PaginationAdminUserDto } from './dto/pagination-admin-user.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { SendEmailService } from 'src/modules/send-email/sendEmail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly sendEmailService: SendEmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Danh sách user theo role (USER hoặc OWNER)
   */
  async listUsers(query: PaginationAdminUserDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where: any = {};

    if (query.search) {
      where.email = Like(`%${query.search}%`);
    }

    if (query.role) {
      where.role = query.role;
    }

    const [items, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: items,
      meta: { page, limit, total },
    };
  }

  /**
   * Sinh mật khẩu ngẫu nhiên cho owner
   */
  private generateRandomPassword(length = 10): string {
    const chars1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const chars2 = 'abcdefghijklmnopqrstuvwxyz';
    const chars3 = '0123456789';
    const chars4 = '@#';
    let password = '';
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * chars1.length);
      password += chars1[idx];
    }
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * chars2.length);
      password += chars2[idx];
    }
    for (let i = 0; i < length - 6; i++) {
      const idx = Math.floor(Math.random() * chars3.length);
      password += chars3[idx];
    }
    for (let i = 0; i < 2; i++) {
      const idx = Math.floor(Math.random() * chars4.length);
      password += chars4[idx];
    }
    return password;
  }

  async createOwnerFromUser(userId: string) {
    const numericId = Number(userId);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('userId không hợp lệ');
    }

    const baseUser = await this.userRepository.findOne({
      where: { id: numericId, role: UserRole.USER },
    });
    if (!baseUser) {
      throw new NotFoundException(
        'User không tồn tại hoặc không phải role USER',
      );
    }

    const existedOwner = await this.userRepository.findOne({
      where: { email: baseUser.email, role: UserRole.OWNER },
    });
    if (existedOwner) {
      throw new BadRequestException(
        'Tài khoản owner với email này đã tồn tại trong hệ thống',
      );
    }

    const plainPassword = this.generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const owner = this.userRepository.create({
      name: baseUser.name,
      email: baseUser.email,
      phone: baseUser.phone ?? '',
      password: hashedPassword,
      role: UserRole.OWNER,
      isActive: true,
    });

    const savedOwner = await this.userRepository.save(owner);

    const mode = this.configService.get<string>('NODE_ENV', 'prod');
    await this.sendEmailService.sendMailStoreAccount(
      baseUser.email,
      'Thông tin tài khoản chủ sân',
      {
        fullName: baseUser.name,
        username: baseUser.email,
        password: plainPassword,
      },
      mode,
    );

    return savedOwner;
  }

  async getOwnerById(id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const owner = await this.userRepository.findOne({
      where: { id: numericId, role: UserRole.OWNER },
    });
    if (!owner) {
      throw new NotFoundException('Owner không tồn tại');
    }

    return owner;
  }

  async updateOwner(id: string, dto: UpdateOwnerDto) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
    }

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const owner = await this.userRepository.findOne({
      where: { id: numericId, role: UserRole.OWNER },
    });
    if (!owner) {
      throw new NotFoundException('Owner không tồn tại');
    }

    if (dto.fullName !== undefined) {
      owner.name = dto.fullName;
    }
    if (dto.phone !== undefined) {
      owner.phone = dto.phone;
    }
    if (dto.isActive !== undefined) {
      owner.isActive = dto.isActive;
    }

    return this.userRepository.save(owner);
  }

  async deleteOwner(id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const owner = await this.userRepository.findOne({
      where: { id: numericId, role: UserRole.OWNER },
    });
    if (!owner) {
      throw new NotFoundException('Owner không tồn tại');
    }

    await this.userRepository.remove(owner);
    return 'Xóa owner thành công';
  }

  async deleteUser(id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    const user = await this.userRepository.findOne({
      where: { id: numericId, role: UserRole.USER },
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    await this.userRepository.remove(user);
    return 'Xóa user thành công';
  }
}
