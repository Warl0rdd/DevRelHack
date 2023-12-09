import {Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import RegistrationResponse from "./dto/auth/registration.response";
import RegistrationDto from "./dto/auth/registration.dto";
import LoginResponse from "./dto/auth/login.response";
import LoginDto from "./dto/auth/login.dto";
import UpdateResponse from "./dto/auth/update.response";
import UpdateDto from "./dto/auth/update.dto";

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @ApiOperation({ summary: 'registration' })
  @Post('/register')
  @ApiResponse({ type: RegistrationResponse })
  @HttpCode(201)
  registration(@Body() registrationDto: RegistrationDto) {

  }

  @ApiOperation({ summary: 'login' })
  @Post('/login')
  @ApiResponse({ type: LoginResponse })
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {

  }

  @ApiOperation({
    summary: 'update a user',
    description:
        'in a request body provide an instance of user with redacted fields (PROVIDE PASSWORD IN PLAIN TEXT)',
  })
  @Post('/update')
  @ApiResponse({ type: UpdateResponse })
  @HttpCode(200)
  async update(@Body() updateDto: UpdateDto) {

  }
  @ApiOperation({ summary: 'delete a user' })
  @Delete('/delete/:id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {

  }
}
