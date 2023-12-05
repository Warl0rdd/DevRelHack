import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export default class JwtService {
  constructor(private readonly configService: ConfigService) {}

  public generateToken(payload: string): string {
    const jwtSecret = this.configService.get('jwt');
    const token = jwt.sign(payload, jwtSecret.secret);
    return token;
  }
}
