import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiGatewayAuthService } from './api-gateway.auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import AddUserDto from '../dto/auth/request/add-user.dto';
import AddUserMultipleDto from '../dto/auth/request/add-user-multiple.dto';
import AddUserResponseDto from '../dto/auth/response/add-user.response';
import BlockUserDto from '../dto/auth/request/block-user.dto';
import LoginDto from '../../../auth/src/auth/dto/login.dto';
import LoginResponse from '../../../auth/src/auth/dto/login.response';
import RefreshTokenResponse from '../dto/auth/response/refresh-token.response';
import UnblockUserDto from '../dto/auth/request/unblock-user.dto';
import UpdateUserDto from '../dto/auth/request/update-user.dto';
import UpdateUserResponse from '../dto/auth/response/update-user.response';
import CheckTokenGuard from '../../../../libs/common/src/guard/check-token.guard';

@Controller('/api')
export class ApiGatewayAuthController {
  constructor(private readonly apiGatewayService: ApiGatewayAuthService) {}

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'add user' })
  @Post('/auth/add-user')
  @ApiResponse({ type: AddUserResponseDto })
  @HttpCode(201)
  async addUser(@Body() addUserDto: AddUserDto) {
    const result = (await this.apiGatewayService.addUser(addUserDto)) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'add multiple users' })
  @Post('/auth/add-user-multiple')
  @ApiResponse({ type: AddUserMultipleDto })
  @HttpCode(201)
  async addUserMultiple(@Body() addUserMultipleDto: AddUserMultipleDto) {
    const result = (await this.apiGatewayService.addUserMultiple(
      addUserMultipleDto,
    )) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'block user' })
  @Post('/auth/block-user')
  @HttpCode(202)
  async blockUser(@Body() blockUserDto: BlockUserDto) {
    const result = (await this.apiGatewayService.blockUser(
      blockUserDto,
    )) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
  }

  @ApiOperation({ summary: 'login' })
  @Post('/auth/login')
  @ApiResponse({ type: LoginResponse })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const result = (await this.apiGatewayService.login(loginDto)) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'refresh tokens' })
  @Post('/auth/refresh-token')
  @ApiResponse({ type: RefreshTokenResponse })
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenResponse) {
    const result = (await this.apiGatewayService.refreshToken(
      refreshTokenDto,
    )) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'unblock user' })
  @Post('/auth/unblock-user')
  @HttpCode(202)
  async unblockUser(@Body() unblockUserDto: UnblockUserDto) {
    const result = (await this.apiGatewayService.unblockUser(
      unblockUserDto,
    )) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'update user' })
  @Post('/auth/update-user')
  @ApiResponse({ type: UpdateUserResponse })
  @HttpCode(200)
  async update(@Body() updateUserDto: UpdateUserDto) {
    const result = (await this.apiGatewayService.updateUser(
      updateUserDto,
    )) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }
}
