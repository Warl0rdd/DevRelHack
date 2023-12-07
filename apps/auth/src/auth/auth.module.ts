import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import JwtModule from '../jwt/jwt.module';
import { typeormConfig } from '../config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../db/entities/user.entity';
import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [typeormConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('typeorm');
        return { ...dbConfig, entities: [User], synchronize: true };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
