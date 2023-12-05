import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import HelloDto from './hello.dto';
import HelloResponse from './hello.response';

@ApiTags('Hello world')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'hello' })
  @ApiResponse({ type: String })
  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @ApiOperation({ summary: 'hello' })
  @ApiResponse({ type: HelloResponse })
  @Post()
  @HttpCode(200)
  postHello(@Body() helloDto: HelloDto): HelloResponse {
    return {
      helloAnother: helloDto.hello,
    };
  }
}
