import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Query,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import {
    AdminAuth,
    AllAuth,
    UserAuth,
} from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { MyProfileResponseDto } from './dto/my-profile-response.dto';

@Controller('/users')
@ApiTags('Users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @AdminAuth()
    @CustomResponse(UserResponseDto, {
        code: 200,
        message: 'Lấy danh sách người dùng thành công',
        description: '[admin] Danh sách người dùng (phân trang)',
        isPagination: true,
    })
    async listUsers(@Query() query: PaginationDto) {
        return this.userService.listUsers(query);
    }

    @Get('me')
    @AllAuth()
    @CustomResponse(MyProfileResponseDto, {
        code: 200,
        message: 'Lấy thông tin cá nhân thành công',
        description: '[all] Lấy thông tin cá nhân',
    })
    async getMyProfile(@Req() req: Request & { user?: any }) {
        return this.userService.getMyProfile(req.user.id);
    }

    @Patch('me')
    @AllAuth()
    @CustomResponse('string', {
        code: 201,
        message: 'Cập nhật thông tin thành công',
        description: '[all] Cập nhật thông tin cá nhân',
    })
    async updateMyProfile(
        @Req() req: Request & { user?: any },
        @Body() dto: UpdateMyProfileDto,
    ) {
        return this.userService.updateMyProfile(req.user.id, dto);
    }

    @Get(':id')
    @AdminAuth()
    @CustomResponse(MyProfileResponseDto, {
        code: 200,
        message: 'Lấy chi tiết người dùng thành công',
        description: '[admin] Chi tiết người dùng theo id',
    })
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Patch(':id/status')
    @AdminAuth()
    @CustomResponse('string', {
        code: 201,
        message: 'Cập nhật trạng thái thành công',
        description: '[admin] Cập nhật isActive',
    })
    async updateUserStatus(
        @Param('id') id: string,
        @Body() dto: UpdateUserStatusDto,
    ) {
        return this.userService.updateUserStatus(id, dto);
    }

    
}
