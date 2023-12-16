import { Injectable } from '@nestjs/common';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';
import {
  QueueName,
  NotificationServiceMessagePattern,
} from '../../../../libs/common/src';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import GetUserByTelegramResponseMessageData from '../../../../libs/common/src/dto/notification-service/get-user-by-telegram/get-user-by-telegram.response';

@Injectable()
export default class NotificationAdapterService {
  constructor(
    private readonly producerService: RabbitProducerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async getUserEmailByTelegramName(
    telegramName: string,
  ): Promise<RMQResponseMessageTemplate<GetUserByTelegramResponseMessageData>> {
    const uuid = randomUUID();
    const data = { telegramName };
    await this.producerService.produce({
      queue: QueueName.notification_queue,
      pattern: NotificationServiceMessagePattern.getUserByTelegramName,
      data,
      reply: {
        correlationId: uuid,
        replyTo: QueueName.notification_to_auth_queue_reply,
      },
    });

    const response: RMQResponseMessageTemplate<GetUserByTelegramResponseMessageData> =
      await new Promise((resolve) => {
        this.eventEmitter.once(uuid, async (data) => {
          resolve(JSON.parse(data));
        });
      });

    return response;
  }
}
