import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  AuthServiceMessagePattern,
  getCorrelationIdFromRMQContext,
  getDataFromRMQContext,
  getReplyToFromRMQContext,
} from '../../../../libs/common/src';
import { AuthService } from './auth.service';
import LoginMessageData from '../../../../libs/common/src/dto/auth-service/login.message-data';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';

@Controller()
export default class AuthConsumer {
  constructor(
    private readonly authService: AuthService,
    private readonly producer: RabbitProducerService,
  ) {}

  @MessagePattern(AuthServiceMessagePattern.login)
  public async login(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<LoginMessageData>(ctx);
    const result = await this.authService.login(data);

    const replyto = getReplyToFromRMQContext(ctx);
    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(AuthServiceMessagePattern.refreshTokens)
  public async refreshTokens(@Ctx() ctx: RmqContext) {
    // TODO
  }

  @MessagePattern(AuthServiceMessagePattern.updateProfile)
  public async updateProfile(@Ctx() ctx: RmqContext) {
    // TODO
  }

  @MessagePattern(AuthServiceMessagePattern.addUser)
  public async addUser(@Ctx() ctx: RmqContext) {
    // TODO
  }

  @MessagePattern(AuthServiceMessagePattern.addUserMultiple)
  public async addUserMultiple(@Ctx() ctx: RmqContext) {
    // TODO
  }

  @MessagePattern(AuthServiceMessagePattern.blockUser)
  public async blockUser(@Ctx() ctx: RmqContext) {
    // TODO
  }

  @MessagePattern(AuthServiceMessagePattern.unblockUser)
  public async unblockUser(@Ctx() ctx: RmqContext) {
    // TODO
  }

  @MessagePattern(AuthServiceMessagePattern.deleteUser)
  public async deleteUser(@Ctx() ctx: RmqContext) {
    // TODO
  }
}
