import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async listUsers(pagination: PaginationDto) {
        const where: any = {};
        if (pagination.search) {
            where.email = Like(`%${pagination.search}%`);
        }

        const page = pagination.page ?? 1;
        const limit = pagination.limit ?? 10;
        const [items, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
            where,
        });

        return {
            data: items,
            meta: { page, limit, total },
        };
    }

    async getUserById(id: string) {
        const numericId = Number(id);
        const user = await this.userRepository.findOne({
            where: { id: numericId },
        });
        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }
        return user;
    }

    async updateUserStatus(id: string, dto: UpdateUserStatusDto) {
        const numericId = Number(id);
        const user = await this.userRepository.findOne({
            where: { id: numericId },
        });
        if (!user) {
            throw new NotFoundException('User không tồn tại');
        }
        user.isActive = dto.isActive;
        await this.userRepository.save(user);
        return 'Cập nhật trạng thái thành công';
    }

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
        // Map fullName từ DTO sang field name của entity
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
