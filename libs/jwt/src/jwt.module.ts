import { Module } from '@nestjs/common';
import JwtTokenService from './jwt.service';
import { PROVIDE_JWT_SECRET } from './jwt.const';

@Module({
  imports: [],
  providers: [
    JwtTokenService,
    {
      useValue: 'secret',
      provide: PROVIDE_JWT_SECRET,
    },
  ],
  exports: [JwtTokenService],
})
export default class JwtTokenModule {}
