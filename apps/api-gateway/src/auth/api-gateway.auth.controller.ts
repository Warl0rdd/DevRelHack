import {
  Body,
  Controller,
  Get,
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
import UpdateUserResponse from '../dto/auth/response/update-user.response';
import CheckTokenGuard from '../../../../libs/common/src/guard/check-token.guard';
import ChangePasswordRequest from '../dto/auth/request/change-password.request';
import UpdateProfileDto from '../dto/auth/request/update-profile.dto';
import { User } from '../../../../libs/common/src/decorator/get-user.decorator';
import SendTelegramCodeRequest from '../dto/auth/request/send-telegram-code.request';
import UserAddTelegramDto from '../dto/notification/request/user-add-telegram.dto';
import { NotificationService } from '../notification/api-gateway.notification.service';
import JwtUserPayload from '../../../../libs/common/src/dto/common/jwt.payload';
import TelegramLoginRequest from '../dto/auth/request/telegram-login.request';

@ApiTags('Auth')
@Controller('auth')
export class ApiGatewayAuthController {
  constructor(
    private readonly apiGatewayService: ApiGatewayAuthService,
    private readonly notificationService: NotificationService,
  ) {}

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
  @ApiOperation({ summary: 'update profile' })
  @Post('update-profile')
  @ApiResponse({ type: UpdateUserResponse })
  @HttpCode(200)
  async updateProfile(
    @Body() updateUserDto: UpdateProfileDto,
    @User() user: any,
  ) {
    const result = (await this.apiGatewayService.updateProfile({
      email: user.email,
      ...updateUserDto,
    })) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'Get profile' })
  @Get('self')
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

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'Получить подсказки по тэгам для пользователя' })
  @Get('tags')
  @HttpCode(200)
  async getTags() {
    const result = await this.apiGatewayService.getTags();
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data.tags;
  }

  @ApiOperation({ summary: 'Вход по коду из телеграмма' })
  @Post('login/telegram')
  @HttpCode(200)
  async loginTelegram(@Body() data: TelegramLoginRequest) {
    const result = await this.apiGatewayService.telegramLogin(data);
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

  @ApiOperation({ summary: 'Отправить код для входа телеграмм' })
  @Post('telegram/code')
  @HttpCode(200)
  async sendTelegramCode(@Body() data: SendTelegramCodeRequest) {
    const result = (await this.apiGatewayService.sendTelegramCode(data)) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
  }

  @ApiBearerAuth()
  @UseGuards(CheckTokenGuard)
  @ApiOperation({
    summary: 'Отправить запрос на добавление телеграмм аккаунта',
  })
  @Patch('telegram/add')
  @HttpCode(200)
  async addTelegramAccount(
    @Body() data: UserAddTelegramDto,
    @User() user: JwtUserPayload,
  ) {
    const result = (await this.notificationService.addUserTelegram({
      email: user.email,
      telegramName: data.telegramName,
    })) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);

    return result.data;
  }
}
