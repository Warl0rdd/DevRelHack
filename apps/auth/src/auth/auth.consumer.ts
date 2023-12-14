import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  AuthServiceMessagePattern,
  getCorrelationIdFromRMQContext,
  getDataFromRMQContext,
  getReplyToFromRMQContext,
} from '../../../../libs/common/src';
import { AuthService } from './auth.service';
import LoginRequestMessageData from '../../../../libs/common/src/dto/auth-service/login/login.request.message-data';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';
import AddUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/add-user/add-user.request.message-data';
import RefreshTokenRequestMessageData from '../../../../libs/common/src/dto/auth-service/refresh-token/refresh-token.request.message-data';
import UpdateUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/update-user/update-user.request.message-data';
import BlockUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/block-user/block-user.request.message-data copy';
import UnBlockUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/unblock-user/unblock-user.request.message-data';
import GetUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/get-user/get-user.request.message-data';
import ChangePasswordRequestMessageData from '../../../../libs/common/src/dto/auth-service/change-password/change-password.request.message-data';
import SendTelegramCodeRequestMessageData from '../../../../libs/common/src/dto/auth-service/send-telegram-code/send-telegram-code.request.message-data';
import TelegramLoginRequestMessageData from '../../../../libs/common/src/dto/auth-service/telegram-login/telegram-login.request.message-data';

@Controller()
export default class AuthConsumer {
  constructor(
    private readonly authService: AuthService,
    private readonly producer: RabbitProducerService,
  ) {}

  @MessagePattern(AuthServiceMessagePattern.login)
  public async login(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<LoginRequestMessageData>(ctx);
    const result = await this.authService.login(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.refreshTokens)
  public async refreshTokens(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<RefreshTokenRequestMessageData>(ctx);
    const result = await this.authService.refreshTokens(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.updateProfile)
  public async updateProfile(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<UpdateUserRequestMessageData>(ctx);
    const result = await this.authService.update(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.addUser)
  public async addUser(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<AddUserRequestMessageData>(ctx);
    const result = await this.authService.addUser(data);
    console.log(result);
    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.blockUser)
  public async blockUser(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<BlockUserRequestMessageData>(ctx);
    const result = await this.authService.blockUser(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.unblockUser)
  public async unblockUser(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<UnBlockUserRequestMessageData>(ctx);
    const result = await this.authService.unblockUser(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.getUser)
  public async getUser(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<GetUserRequestMessageData>(ctx);
    const result = await this.authService.getUser(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.changePassword)
  public async changePassword(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<ChangePasswordRequestMessageData>(ctx);
    const result = await this.authService.changePassword(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.sendTelegramCode)
  public async sendTelegramCode(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<SendTelegramCodeRequestMessageData>(ctx);
    const result = await this.authService.sendTelegramCode(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.telegramLogin)
  public async telegramLogin(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<TelegramLoginRequestMessageData>(ctx);
    const result = await this.authService.telegramLogin(data);

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }
}
