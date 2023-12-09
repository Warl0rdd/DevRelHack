import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import {
  NotificationServiceMessagePattern,
  getDataFromRMQContext,
} from '../../../../libs/common/src';
import TelegramService from './telegram.service';

@Controller()
export default class TelegramConsumer {
  constructor(
    private readonly producer: RabbitProducerService,
    private readonly eventEmitter: EventEmitter2,
    private readonly telegramService: TelegramService,
  ) {}

  @MessagePattern(NotificationServiceMessagePattern.telegramSingle)
  async sendMessageSingleUser(@Ctx() context: RmqContext) {
    const data = getDataFromRMQContext<{
      email: string;
      message: string;
    }>(context);
    await this.telegramService.sendMessageByUserEmail(data.email, data.message);
  }

  @MessagePattern(NotificationServiceMessagePattern.telegramMultiple)
  async sendMessageMultipleUsers(@Ctx() context: RmqContext) {
    const data = getDataFromRMQContext<{
      emails: string[];
      message: string;
    }>(context);
    await this.telegramService.sendMessageMultipleUsersByEmail(
      data.emails,
      data.message,
    );
  }
}
