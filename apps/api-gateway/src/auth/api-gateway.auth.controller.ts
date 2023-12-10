import {Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import { ApiGatewayAuthService } from './api-gateway.auth.service';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import AddUserDto from "../dto/auth/request/add-user.dto";
import AddUserMultipleDto from "../dto/auth/request/add-user-multiple.dto";
import AddUserResponseDto from "../dto/auth/response/add-user.response";
import BlockUserDto from "../dto/auth/request/block-user.dto";

@Controller('/api')
export class ApiGatewayAuthController {
  constructor(private readonly apiGatewayService: ApiGatewayAuthService) {}

  @ApiOperation({ summary: 'registration' })
  @Post('/auth/add-user')
  @ApiResponse({ type: AddUserResponseDto })
  @HttpCode(201)
  async registration(@Body() addUserDto: AddUserDto) {
    const result = (await this.apiGatewayService.addUser(addUserDto)) as any
    if (!result.success) throw new HttpException(result.error.message, result.error.statusCode)
  }

  @ApiOperation({summary: 'add multiple users'})
  @Post('/auth/add-user-multiple')
  @ApiResponse({ type: AddUserMultipleDto })
  @HttpCode(201)
  async addUserMultiple(@Body() addUserMultipleDto: AddUserMultipleDto) {
    const result = (await this.apiGatewayService.addUserMultiple(addUserMultipleDto)) as any
    if (!result.success) throw new HttpException(result.error.message, result.error.statusCode)
  }

  @ApiOperation({ summary: 'block user' })
  @Post('/auth/block-user')
  @HttpCode(202)
  async blockUser(@Body() blockUserDto: BlockUserDto) {
    await this.apiGatewayService.blockUser(blockUserDto)
  }
}
