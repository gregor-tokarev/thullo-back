import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthSharedModule } from './shared/auth-shared.module';

@Module({
  controllers: [AuthController],
  imports: [AuthSharedModule],
})
export class AuthModule {}
