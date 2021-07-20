import { AuthSocketGuard } from './auth-socket.guard';

describe('AuthSocketGuard', () => {
  it('should be defined', () => {
    expect(new AuthSocketGuard()).toBeDefined();
  });
});
