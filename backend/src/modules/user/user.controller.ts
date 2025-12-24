import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AllAuth } from 'src/shared/decorators/role-auth.decorator';
import { CustomResponse } from 'src/shared/decorators/custom-response.decorator';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { MyProfileResponseDto } from './dto/my-profile-response.dto';

@Controller('/users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
