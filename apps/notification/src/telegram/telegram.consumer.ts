import { Controller, Injectable, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export default class TelegramConsumer {
  @MessagePattern('telegram')
  getNotifications(@Ctx() context: RmqContext, @Payload() data: any) {
    const message = (context.getMessage().content as Buffer).toString();
    Logger.verbose(`Message consumed ${message}, ${data}`);
  }

  @MessagePattern('undefined')
  handleUndefined(@Payload() data: number[], @Ctx() context: RmqContext) {
    console.log(`Data: ${data}`);
  }
}
