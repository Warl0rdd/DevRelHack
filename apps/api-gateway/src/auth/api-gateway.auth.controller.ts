import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiGatewayAuthService } from './api-gateway.auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import LoginDto from '../../../auth/src/auth/dto/login.dto';
import LoginResponse from '../../../auth/src/auth/dto/login.response';
import RefreshTokenResponse from '../dto/auth/response/refresh-token.response';
import UpdateUserDto from '../dto/auth/request/update-user.dto';
import UpdateUserResponse from '../dto/auth/response/update-user.response';
import CheckTokenGuard from '../../../../libs/common/src/guard/check-token.guard';
import ChangePasswordRequest from '../dto/auth/request/change-password.request';

@ApiTags('Auth')
@Controller('auth')
export class ApiGatewayAuthController {
  constructor(private readonly apiGatewayService: ApiGatewayAuthService) {}

  @ApiOperation({ summary: 'login' })
  @Post('login')
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
  @Post('refresh-token')
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
  @ApiOperation({ summary: 'update user' })
  @Post('update-user')
  @ApiResponse({ type: UpdateUserResponse })
  @HttpCode(200)
  async updateProfile(@Body() updateUserDto: UpdateUserDto) {
    const result = (await this.apiGatewayService.updateProfile(
      updateUserDto,
    )) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'Get profile' })
  @Post('self')
  @ApiResponse({ type: UpdateUserResponse })
  @HttpCode(200)
  async getSelf(@Req() request: Request) {
    const userData = request.headers['user'];
    const result = (await this.apiGatewayService.getProfile({
      email: userData.email,
    })) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'Change password' })
  @Patch('change-password')
  @HttpCode(200)
  async changePassword(
    @Req() request: Request,
    @Body() data: ChangePasswordRequest,
  ) {
    const userData = request.headers['user'];
    const result = (await this.apiGatewayService.changePassword({
      ...data,
      email: userData.email,
    })) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
  }
}
