import { Controller, Get } from '@nestjs/common';
import { WikiService } from './wiki.service';

@Controller()
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get()
  getHello(): string {
    return this.wikiService.getHello();
  }
}
