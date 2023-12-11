import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export default class CheckTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      if (!authHeader) return false;
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET);
      return false;
    } catch (e) {
      return false;
    }
  }
}
