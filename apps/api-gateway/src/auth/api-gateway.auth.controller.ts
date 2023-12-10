import {Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import { ApiGatewayAuthService } from './api-gateway.auth.service';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import RegistrationResponse from "../dto/auth/registration.response";
import LoginResponse from "../dto/auth/login.response";
import LoginDto from "../dto/auth/login.dto";
import UpdateResponse from "../dto/auth/update.response";
import UpdateDto from "../dto/auth/update.dto";
import AddUserRequestMessageData from "@app/common/dto/auth-service/add-user/add-user.request.message-data";
import {Response} from "express";

@Controller('/api')
export class ApiGatewayAuthController {
  constructor(private readonly apiGatewayService: ApiGatewayAuthService) {}

  @ApiOperation({ summary: 'registration' })
  @Post('/auth/add-user')
  @ApiResponse({ type: RegistrationResponse })
  @HttpCode(201)
  registration(@Body() addUserDto: AddUserRequestMessageData) {
    return this.apiGatewayService.addUser(addUserDto)
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
