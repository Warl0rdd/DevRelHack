import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import User from '../db/entities/user.entity';
import { DateTime } from 'luxon';

@Injectable()
export default class JwtService {
  constructor(private readonly configService: ConfigService) {}

  public generateToken(payload: User): string {
    const jwtSecret = this.configService.get('jwt');
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        position: payload.position,
        iat: DateTime.now().toUnixInteger(),
        eat: DateTime.now().plus({ hour: 1 }).toUnixInteger(),
      },
      jwtSecret.secret,
    );
  }
}
