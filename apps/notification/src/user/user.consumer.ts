import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  NotificationServiceMessagePattern,
  getDataFromRMQContext,
} from '../../../../libs/common/src';
import UserService from './user.service';
import UserRegisteredRequest from '../../../../libs/common/src/dto/notification-service/user-registered/user-registered.request';
import UserAddTelegramRequestMessageData from '../../../../libs/common/src/dto/notification-service/user-add-telegram/user-add-telegram.request';

@Injectable()
export default class UserConsumer {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(NotificationServiceMessagePattern.userRegistered)
  public async userRegistered(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<UserRegisteredRequest>(ctx);
    await this.userService.addUser(data.email);
  }

  @MessagePattern(NotificationServiceMessagePattern.userAddTelegram)
  public async userAddTelegram(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<UserAddTelegramRequestMessageData>(ctx);
    await this.userService.addTelegramAccount(data.email, data.telegramName);
  }
}
