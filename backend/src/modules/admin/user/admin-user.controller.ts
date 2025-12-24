import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminUserService } from './admin-user.service';
import { AdminAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { PaginationAdminUserDto } from './dto/pagination-admin-user.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Controller('/admin/users')
@ApiTags('Admin - Users')
@AdminAuth()
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @CustomResponse(AdminUserResponseDto, {
    code: 200,
    message: 'Lấy danh sách user thành công',
    description: '[admin] Danh sách user/owner (phân trang)',
    isPagination: true,
  })
  async listUsers(@Query() query: PaginationAdminUserDto) {
    return this.adminUserService.listUsers(query);
  }

  // ---------- OWNER (role OWNER) ----------

  @Post('owners/:userId')
  @CustomResponse(AdminUserResponseDto, {
    code: 201,
    message: 'Tạo owner thành công',
    description: '[admin] Tạo owner từ userId (role OWNER) sau khi phê duyệt',
  })
  async createOwnerFromUser(@Param('userId') userId: string) {
    return this.adminUserService.createOwnerFromUser(userId);
  }

  @Get('owners/:id')
  @CustomResponse(AdminUserResponseDto, {
    code: 200,
    message: 'Lấy chi tiết owner thành công',
    description: '[admin] Xem chi tiết owner theo id',
  })
  async getOwnerById(@Param('id') id: string) {
    return this.adminUserService.getOwnerById(id);
  }

  @Put('owners/:id')
  @CustomResponse(AdminUserResponseDto, {
    code: 200,
    message: 'Cập nhật owner thành công',
    description: '[admin] Cập nhật thông tin owner',
  })
  async updateOwner(@Param('id') id: string, @Body() dto: UpdateOwnerDto) {
    return this.adminUserService.updateOwner(id, dto);
  }

  @Delete('owners/:id')
  @CustomResponse('string', {
    code: 200,
    message: 'Xóa owner thành công',
    description: '[admin] Xóa owner theo id',
  })
  async deleteOwner(@Param('id') id: string) {
    return this.adminUserService.deleteOwner(id);
  }
}
