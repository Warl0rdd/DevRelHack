import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiGatewayAuthService } from './api-gateway.auth.service';
import {
  ApiBearerAuth,
  ApiConsumes,
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
import RegisterRequest from '../dto/auth/request/register.request';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class ApiGatewayAuthController {
  constructor(
    private readonly apiGatewayService: ApiGatewayAuthService,
    private readonly notificationService: NotificationService,
  ) {}

  @ApiOperation({ summary: 'Register' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('register')
  @ApiResponse({ type: LoginResponse })
  @HttpCode(200)
  async register(
    @Body() dto: RegisterRequest,
    @UploadedFile('file') file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const result = await this.apiGatewayService.register(
      { ...dto, profilePicture: file },
      request,
    );
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
    return result.data;
  }

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
  @ApiConsumes('multipart/form-data')
  @UseGuards(CheckTokenGuard)
  @ApiOperation({ summary: 'update profile' })
  @Post('update-profile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: UpdateUserResponse })
  @HttpCode(200)
  async updateProfile(
    @Body() updateUserDto: UpdateProfileDto,
    @User() user: any,
    @UploadedFile('file') file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const result = (await this.apiGatewayService.updateProfile(
      {
        email: user.email,
        ...updateUserDto,
        profilePicture: file,
      },
      request,
    )) as any;
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
  async getSelf(@User() user: JwtUserPayload) {
    const result = (await this.apiGatewayService.getProfile({
      email: user.email,
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
    @Body() data: ChangePasswordRequest,
    @User() user: JwtUserPayload,
  ) {
    const result = (await this.apiGatewayService.changePassword({
      ...data,
      email: user.email,
    })) as any;
    if (!result.success)
      throw new HttpException(result.error.message, result.error.statusCode);
  }

  @ApiBearerAuth()
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
