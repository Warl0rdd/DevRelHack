import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';

@Controller()
export default class TelegramConsumer {
  constructor(private readonly producer: RabbitProducerService) {}

  @MessagePattern('telegram')
  getNotifications(@Ctx() context: RmqContext, @Payload() data: any) {
    const message = (context.getMessage().content as Buffer).toString();
    Logger.verbose(`Message consumed ${message}`);
    if (context.getMessage().properties.replyTo) {
      Logger.verbose(
        `Should reply to message: ${context.getMessage().properties.replyTo}`,
      );
      this.producer.produce(
        JSON.stringify({ test: 1 }),
        context.getMessage().properties.replyTo,
      );
    }
  }
}
