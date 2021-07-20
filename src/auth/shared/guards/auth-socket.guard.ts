import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Socket } from 'socket.io';

@Injectable()
export class AuthSocketGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const authToken: string =
      client.handshake.headers.authorization.split(' ')[1];

    const user = await this.authService.verifyUser(authToken);

    !user && client.disconnect();
    client.handshake.auth.user = user;
    return true;
  }
}
