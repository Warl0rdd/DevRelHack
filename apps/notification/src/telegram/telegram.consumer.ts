import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  NotificationServiceMessagePattern,
  getDataFromRMQContext,
} from '../../../../libs/common/src';
import TelegramService from './telegram.service';
import TelegramSingleRequestMessageData from '../../../../libs/common/src/dto/notification-service/telegram-single/telegram-single.request';
import TelegramMultipleRequestMessageData from '../../../../libs/common/src/dto/notification-service/telegram-multiple/telegram-multiple.request';

@Controller()
export default class TelegramConsumer {
  constructor(private readonly telegramService: TelegramService) {}

  @MessagePattern(NotificationServiceMessagePattern.telegramSingle)
  async sendMessageSingleUser(@Ctx() context: RmqContext) {
    const data =
      getDataFromRMQContext<TelegramSingleRequestMessageData>(context);
    await this.telegramService.sendMessageByUserEmail(data.email, data.message);
  }

  @MessagePattern(NotificationServiceMessagePattern.telegramMultiple)
  async sendMessageMultipleUsers(@Ctx() context: RmqContext) {
    const data =
      getDataFromRMQContext<TelegramMultipleRequestMessageData>(context);
    await this.telegramService.sendMessageMultipleUsersByEmail(
      data.emails,
      data.message,
    );
  }
}
