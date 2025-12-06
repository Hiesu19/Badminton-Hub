import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessCacheRepository } from 'src/modules/redis/business-cache.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private businessCacheRepository: BusinessCacheRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Thiếu header Authorization');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Header Authorization không đúng định dạng',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_KEY || process.env.JWT_SECRET,
      });

      const cachedTokenVersion =
        await this.businessCacheRepository.getTokenVersion(payload.id);
      if (payload.tokenVersion !== Number(cachedTokenVersion)) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      if (
        payload.mustChangePassword &&
        request.url !== '/auth/must-change-password'
      ) {
        throw new UnauthorizedException('Bạn cần thay đổi mật khẩu');
      }

      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException(
        err.name === 'TokenExpiredError'
          ? 'Token đã hết hạn'
          : 'Token không hợp lệ',
      );
    }
  }
}
