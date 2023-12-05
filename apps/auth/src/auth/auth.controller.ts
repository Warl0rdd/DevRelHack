import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import RegistrationDto from './dto/registration.dto';
import RegistrationResponse from './dto/registration.response';

@ApiTags('Auth')
@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'registration' })
  @Post('/register')
  @ApiResponse({ type: RegistrationResponse })
  @HttpCode(201)
  registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.create(registrationDto);
  }
}
