import { Injectable } from '@nestjs/common';

@Injectable()
export class WikiService {
  getHello(): string {
    return 'Hello World!';
  }
}
