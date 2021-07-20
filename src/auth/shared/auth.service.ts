import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../user/shared/repositories/user.repository';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { OauthResponseDto } from '../dto/oauth-response.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../user/entities/user.entity';
import { verify } from 'jsonwebtoken';
import { config } from 'dotenv';
import { WsException } from '@nestjs/websockets';

config({
  path: `.env.${process.env}`,
});

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signupUserWithEmail(
    createUserDto: CreateUserDto,
  ): Promise<AuthResponse> {
    const user = await this.userRepository.createUser(createUserDto, {
      type: 'email',
    });
    const accessToken = await this.generateAccessToken({ email: user.email });
    return { accessToken };
  }

  async authUserWithGoogle(
    googleResponseDto: OauthResponseDto,
  ): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({
      email: googleResponseDto.email,
      authMethod: 'google',
    });
    if (existingUser) {
      const accessToken = await this.generateAccessToken({
        email: existingUser.email,
      });
      return { accessToken };
    }

    const user = await this.userRepository.createUser(
      { email: googleResponseDto.email, avatar: googleResponseDto.picture },
      { type: 'google', googleAccessToken: googleResponseDto.accessToken },
    );
    const accessToken = await this.generateAccessToken({ email: user.email });
    return { accessToken };
  }

  async authUserWithFacebook(
    facebookResponseDto: OauthResponseDto,
  ): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({
      email: facebookResponseDto.email,
      authMethod: 'facebook',
    });

    if (existingUser) {
      const accessToken = await this.generateAccessToken({
        email: existingUser.email,
      });
      return { accessToken };
    }
    const user = await this.userRepository.createUser(
      { email: facebookResponseDto.email },
      {
        type: 'facebook',
        facebookAccessToken: facebookResponseDto.accessToken,
      },
    );
    const accessToken = await this.generateAccessToken({ email: user.email });
    return { accessToken };
  }

  async generateAccessToken(jwtPayload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync({
      email: jwtPayload.email,
    });
  }

  async verifyUser(jwtToken: string): Promise<User> {
    if (!jwtToken) {
      throw new WsException('Pass accessToken in headers');
    }
    const { email } = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
    return this.userRepository.findOne({ email });
  }
}
