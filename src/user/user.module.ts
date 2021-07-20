import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSharedModule } from './shared/user-shared.module';

@Module({
  controllers: [UserController],
  imports: [UserSharedModule],
})
export class UserModule {}
