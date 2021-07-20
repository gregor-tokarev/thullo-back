import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { StatusController } from './status.controller';
import { StatusSharedModule } from './shared/status-shared.module';
import { AuthSharedModule } from '../auth/shared/auth-shared.module';

@Module({
  imports: [AuthSharedModule, StatusSharedModule, StatusSharedModule],
  providers: [StatusGateway],
  controllers: [StatusController],
})
export class StatusModule {}
