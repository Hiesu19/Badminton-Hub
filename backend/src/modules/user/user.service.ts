import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMyProfile(userId: string) {
    const numericId = Number(userId);
    const user = await this.userRepository.findOne({
      where: { id: numericId },
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return user;
  }

  async updateMyProfile(userId: string, dto: UpdateMyProfileDto) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
    }

    const numericId = Number(userId);
    const user = await this.userRepository.findOne({
      where: { id: numericId },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    if (dto.fullName !== undefined) {
      user.name = dto.fullName;
    }

    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }

    if (dto.avatarUrl !== undefined) {
      user.avatarUrl = dto.avatarUrl;
    }

    await this.userRepository.save(user);

    return {
      message: 'Cập nhật thông tin thành công',
      data: user,
    };
  }
}
