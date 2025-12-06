import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './role.decorator';

export const UserAuth = () => {
    return applyDecorators(
        UseGuards(AuthGuard, RoleGuard),
        ApiBearerAuth('access-token'),
        Roles('user'),
    );
};

export const AdminAuth = () => {
    return applyDecorators(
        UseGuards(AuthGuard, RoleGuard),
        ApiBearerAuth('access-token'),
        Roles('admin'),
    );
};

export const AllAuth = () => {
    return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth('access-token'));
};
