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

@Controller()
export default class TelegramConsumer {
  constructor(
    private readonly producer: RabbitProducerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern('telegram')
  getNotifications(@Ctx() context: RmqContext, @Payload() data: any) {
    const message = (context.getMessage().content as Buffer).toString();
    Logger.verbose(`Message consumed ${message}`);
    if (context.getMessage().properties.replyTo) {
      Logger.verbose(
        `Should reply to message: ${context.getMessage().properties.replyTo}`,
      );
      Logger.verbose(
        `Correlation id: ${JSON.stringify(context.getMessage().properties)}`,
      );
      this.producer.reply({
        data: { test: 1 },
        replyQueue: context.getMessage().properties.replyTo,
        correlationId: context.getMessage().properties.correlationId,
      });
    }
  }

  @MessagePattern('test')
  testReplyTo(@Ctx() context: RmqContext, @Payload() data: any) {
    const message = (context.getMessage().content as Buffer).toString();
    Logger.verbose(`Message consumed ${message}`);
    const uuid = randomUUID();
    this.producer.produce({
      data: { test: 1 },
      pattern: 'telegram',
      queue: 'notification_queue',
      reply: { replyTo: 'notification_queue.reply', correlationId: uuid },
    });

    // Received reply here from eventemitter
    this.eventEmitter.once(uuid, (data) => {
      console.log('received reply!', JSON.parse(data));
    });
  }
}
