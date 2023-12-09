import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import JwtModule from './jwt/jwt.module';
import { typeormConfig } from './db/typeorm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [typeormConfig],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
