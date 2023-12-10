import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import RegistrationDto from './dto/registration.dto';
import RegistrationResponse from './dto/registration.response';
import LoginDto from './dto/login.dto';
import LoginResponse from './dto/login.response';
import UpdateDto from './dto/update.dto';
import UpdateResponse from './dto/update.response';

// @ApiTags('Auth')
// @Controller('/api/auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}
//
//   @ApiOperation({ summary: 'registration' })
//   @Post('/register')
//   @ApiResponse({ type: RegistrationResponse })
//   @HttpCode(201)
//   registration(@Body() registrationDto: RegistrationDto) {
//     return this.authService.create(registrationDto);
//   }
//
//   @ApiOperation({ summary: 'login' })
//   @Post('/login')
//   @ApiResponse({ type: LoginResponse })
//   @HttpCode(200)
//   login(@Body() loginDto: LoginDto) {
//     return this.authService.login(loginDto);
//   }
//
//   @ApiOperation({
//     summary: 'update a user',
//     description:
//       'in a request body provide an instance of user with redacted fields (PROVIDE PASSWORD IN PLAIN TEXT)',
//   })
//   @Post('/update')
//   @ApiResponse({ type: UpdateResponse })
//   @HttpCode(200)
//   async update(@Body() updateDto: UpdateDto) {
//     return new UpdateResponse(await this.authService.update(updateDto));
//   }
//
//   @ApiOperation({ summary: 'delete a user' })
//   @Delete('/delete/:id')
//   @HttpCode(204)
//   async delete(@Param('id') id: number) {
//     const success = await this.authService.delete(id);
//     console.log(success);
//     if (!success)
//       throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
//   }
// }
