import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {
  NotificationServiceMessagePattern,
  getCorrelationIdFromRMQContext,
  getDataFromRMQContext,
  getReplyToFromRMQContext,
} from '../../../../libs/common/src';
import TelegramService from './telegram.service';
import TelegramSingleRequestMessageData from '../../../../libs/common/src/dto/notification-service/telegram-single/telegram-single.request';
import TelegramMultipleRequestMessageData from '../../../../libs/common/src/dto/notification-service/telegram-multiple/telegram-multiple.request';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';

@Controller()
export default class TelegramConsumer {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly producer: RabbitProducerService,
  ) {}

  @MessagePattern(NotificationServiceMessagePattern.telegramSingle)
  async sendMessageSingleUser(@Ctx() context: RmqContext) {
    const data =
      getDataFromRMQContext<TelegramSingleRequestMessageData>(context);
    const result = await this.telegramService.sendMessageByUserEmail(
      data.email,
      data.message,
    );
    const replyto = getReplyToFromRMQContext(context);
    if (!replyto) return;

    console.log(replyto);
    const correlationId = getCorrelationIdFromRMQContext(context);
    await this.producer.reply({
      data: result,
      replyQueue: replyto,
      correlationId,
    });
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
