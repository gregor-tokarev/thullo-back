import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardSharedModule } from './shared/board-shared.module';

@Module({
  imports: [BoardSharedModule],
  controllers: [BoardController],
})
export class BoardModule {}
