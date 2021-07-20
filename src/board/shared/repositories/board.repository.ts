import { EntityRepository, Repository } from 'typeorm';
import { Board } from '../../entities/board.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async boardDetails(id: string): Promise<Board> {
    const board = await this.findOne({
      where: { id },
      relations: ['members', 'owner', 'statuses', 'labels'],
    });
    if (!board) {
      throw new NotFoundException('Board is not exists');
    }

    return board;
  }
}
