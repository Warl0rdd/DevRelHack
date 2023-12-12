import { Module } from '@nestjs/common';
import JwtTokenService from './jwt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export default class JwtTokenModule {}
