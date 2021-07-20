import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../../dto/create-user.dto';
import { AuthMethod } from '../../interfaces/auth-method.interface';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtPayload } from '../../../auth/interfaces/jwt-payload.interface';
import { verify } from 'jsonwebtoken';
import { config } from 'dotenv';
import { WsException } from '@nestjs/websockets';

config({
  path: `.env.${process.env.NODE_ENV}`,
});

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor() {
    super();
  }

  async verifyUser(jwt): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const obj: JwtPayload | string = verify(jwt, process.env.JWT_SECRET);
    if (typeof obj === 'string') return;

    const user = this.findOne({ email: obj.email });
    if (!user) {
      throw new WsException('Unauthorized');
    }
    return user;
  }

  async createUser(
    createUserDto: CreateUserDto,
    authMethod: AuthMethod,
  ): Promise<User> {
    const user = new User();

    user.email = createUserDto.email;
    user.authMethod = authMethod.type;
    if (authMethod.type === 'email') {
      user.password = await hash(createUserDto.password, +process.env.JWT_SALT);
      user.setDefaultAvatar();
    } else if (authMethod.type === 'google') {
      user.googleAccessToken = authMethod.googleAccessToken;
      user.avatar = createUserDto.avatar;
    } else if (authMethod.type === 'facebook') {
      user.facebookAccessToken = authMethod.facebookAccessToken;
      user.setDefaultAvatar();
    }

    try {
      return await user.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('User with this email has already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
