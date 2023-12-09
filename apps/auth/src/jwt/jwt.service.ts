import { Injectable } from '@nestjs/common';

@Injectable()
export default class JwtService {
  constructor() {}

  public generateToken(): string {
    return 'TODO: Generate token';
  }
}
