import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  NotificationServiceMessagePattern,
  getCorrelationIdFromRMQContext,
  getDataFromRMQContext,
  getReplyToFromRMQContext,
} from '../../../../libs/common/src';
import UserService from './user.service';
import UserRegisteredRequest from '../../../../libs/common/src/dto/notification-service/user-registered/user-registered.request';
import UserAddTelegramRequestMessageData from '../../../../libs/common/src/dto/notification-service/user-add-telegram/user-add-telegram.request';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';
import GetUserByTelegramRequestMessageData from '../../../../libs/common/src/dto/notification-service/get-user-by-telegram/get-user-by-telegram.request';

@Injectable()
export default class UserConsumer {
  constructor(
    private readonly userService: UserService,
    private readonly producer: RabbitProducerService,
  ) {}

  @MessagePattern(NotificationServiceMessagePattern.userRegistered)
  public async userRegistered(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<UserRegisteredRequest>(ctx);
    await this.userService.addUser(data.email);
  }

  @MessagePattern(NotificationServiceMessagePattern.userAddTelegram)
  public async userAddTelegram(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<UserAddTelegramRequestMessageData>(ctx);
    const result = await this.userService.addTelegramAccount(
      data.email,
      data.telegramName,
    );

    const replyto = getReplyToFromRMQContext(ctx);
    if (!replyto) return;

    const correlationId = getCorrelationIdFromRMQContext(ctx);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
  }

  @MessagePattern(NotificationServiceMessagePattern.getUserByTelegramName)
  public async getUserByTelegramName(@Ctx() ctx: RmqContext) {
    const data =
      getDataFromRMQContext<GetUserByTelegramRequestMessageData>(ctx);
    const result = await this.userService.getUserByTelegramName(
      data.telegramName,
    );

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
