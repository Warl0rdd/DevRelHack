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
import RegistrationDto from "./dto/registration.dto";
import RegistrationResponse from "./response/registration.response";

@ApiTags('Hello world')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: 'registration'})
  @Post()
  @ApiResponse({type: RegistrationResponse})
  @HttpCode(201)
  registration(@Body() registrationDto: RegistrationDto) {
      return this.authService.create(registrationDto)
  }
}
