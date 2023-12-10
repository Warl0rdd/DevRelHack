import { Inject, Injectable } from '@nestjs/common';
import { Buffer } from 'buffer';
import {
  JWT_EXPIRE_ACCESS_TOKEN,
  JWT_EXPIRE_REFRESH_TOKEN,
  PROVIDE_JWT_SECRET,
} from './jwt.const';
import { IJwtPairTokens } from './jwt.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export default class JwtTokenService {
  public constructor(
    @Inject(PROVIDE_JWT_SECRET)
    private readonly jwtSecret: string,
  ) {}

  public sign(data: any, options: jwt.SignOptions) {
    return jwt.sign(data, this.jwtSecret, options);
  }

  public issueAccessToken(
    payload: string | Buffer | Record<string, unknown>,
    expire?: number,
  ): string {
    return this.sign(payload, {
      expiresIn: expire ?? JWT_EXPIRE_ACCESS_TOKEN,
    });
  }

  public issueRefreshToken(
    payload: string | Buffer | Record<string, unknown>,
    expire?: number,
  ): string {
    return this.sign(payload, {
      expiresIn: expire ?? JWT_EXPIRE_REFRESH_TOKEN,
    });
  }

  public issuePairTokens(
    payload: string | Buffer | Record<string, unknown>,
    expireAccess?: number,
    expireRefresh?: number,
  ): IJwtPairTokens {
    return {
      accessToken: this.issueAccessToken(payload, expireAccess),
      refreshToken: this.issueRefreshToken(payload, expireRefresh),
    };
  }

  public decode(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public verify(token: string): boolean {
    try {
      jwt.verify(token, this.jwtSecret);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
