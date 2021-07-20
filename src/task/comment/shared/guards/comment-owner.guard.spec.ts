import { CommentOwnerGuard } from './comment-owner.guard';

describe('CommentOwnerGuard', () => {
  it('should be defined', () => {
    expect(new CommentOwnerGuard()).toBeDefined();
  });
});
