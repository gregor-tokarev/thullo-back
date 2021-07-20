import { Controller, Patch, Param, UseGuards, Get } from '@nestjs/common';
import { UserService } from './shared/user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('user/:id')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update/google-avatar')
  updateUserAvatar(@Param('id') id: string): Promise<User> {
    return this.userService.updateAvatarFromGoogle(id);
  }

  @Get('profile')
  async getUserProfile(@Param('id') userId: string): Promise<User> {
    const user = await this.userService.findById(userId);
    user.publicView();

    return user;
  }
}
