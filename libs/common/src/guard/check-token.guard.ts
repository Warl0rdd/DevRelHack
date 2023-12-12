import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export default class CheckTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      if (!authHeader) return false;
      const token = authHeader.split(' ')[1];
      console.log(process.env.JWT_SECRET);
      const data = jwt.verify(token, process.env.JWT_SECRET);
      request.headers['user'] = data;
      console.log(data);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
