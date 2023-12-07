import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import RabbitmqPublisherService from '../transport/rabbitmq.publisher.service';
import { TELEGRAM_PATTERN } from '../transport/rabbitmq.pattern.const';

@Controller()
export default class TelegramConsumer {
  constructor(
    private readonly rabbitMqPublisherService: RabbitmqPublisherService,
  ) {}

  @MessagePattern('telegram')
  getNotifications(@Ctx() context: RmqContext, @Payload() data: any) {
    const message = (context.getMessage().content as Buffer).toString();
    Logger.verbose(`Message consumed ${message}, ${data}`);
  }

  @MessagePattern('undefined')
  async handleUndefined(@Payload() data: number[], @Ctx() context: RmqContext) {
    await this.rabbitMqPublisherService.sendToNotificationQueue(
      TELEGRAM_PATTERN,
      {
        value: 'my-value',
      },
    );
  }

  @MessagePattern('test')
  handleTest(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log(`Data: ${data}`);
  }
}
