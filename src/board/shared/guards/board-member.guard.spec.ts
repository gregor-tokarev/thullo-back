import { BoardMemberGuard } from './board-member.guard';

describe('BoardMemberGuard', () => {
  it('should be defined', () => {
    expect(new BoardMemberGuard()).toBeDefined();
  });
});
