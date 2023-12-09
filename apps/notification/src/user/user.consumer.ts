import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  NotificationServiceMessagePattern,
  getDataFromRMQContext,
} from '../../../../libs/common/src';
import UserService from './user.service';

@Injectable()
export default class UserConsumer {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(NotificationServiceMessagePattern.userRegistered)
  public async userRegistered(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<{ email: string }>(ctx);
    await this.userService.addUser(data.email);
  }

  @MessagePattern(NotificationServiceMessagePattern.userAddTelegram)
  public async userAddTelegram(@Ctx() ctx: RmqContext) {
    const data = getDataFromRMQContext<{ email: string; telegramName: string }>(
      ctx,
    );
    await this.userService.addTelegramAccount(data.email, data.telegramName);
  }
}
