import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './role.decorator';
import { UserRole } from '../enums/user.enum';

export const UserAuth = () => {
  return applyDecorators(
    UseGuards(AuthGuard, RoleGuard),
    ApiBearerAuth('access-token'),
    Roles(UserRole.USER),
  );
};

// Dùng cho admin hệ thống (SUPER_ADMIN)
export const AdminAuth = () => {
  return applyDecorators(
    UseGuards(AuthGuard, RoleGuard),
    ApiBearerAuth('access-token'),
    Roles(UserRole.SUPER_ADMIN),
  );
};

// Auth cho chủ sân
export const OwnerAuth = () => {
  return applyDecorators(
    UseGuards(AuthGuard, RoleGuard),
    ApiBearerAuth('access-token'),
    Roles(UserRole.OWNER),
  );
};

export const AllAuth = () => {
  return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth('access-token'));
};


