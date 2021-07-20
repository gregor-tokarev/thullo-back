import { createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const extractUserFromReq = (req): User => req.args[0].user;

export const extractUserFromWsReq = (req): User =>
  req.args[0].handshake.auth.user;

export const GetUser = createParamDecorator(
  (data: 'http' | 'ws', req): User => {
    return data === 'http'
      ? extractUserFromReq(req)
      : extractUserFromWsReq(req);
  },
);
