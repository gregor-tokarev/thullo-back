import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
config({
  path: `.env.${process.env.NODE_ENV}`,
});

export const TypeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  port: 5432,
  synchronize: true,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
