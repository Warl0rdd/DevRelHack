import UserRegisteredDto from '../dto/notification/request/user-registered.dto';
import * as crypto from 'crypto';
import { NotificationServiceMessagePattern } from '@app/common';
import { RabbitProducerService } from '@app/rabbit-producer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import UserAddTelegramDto from '../dto/notification/request/user-add-telegram.dto';
import MailSingleDto from '../dto/notification/request/mail-multiple.dto';
import MailMultipleDto from '../dto/notification/request/mail-single.dto';
import TelegramSingleDto from '../dto/notification/request/telegram-single.dto';
import TelegramMultipleDto from '../dto/notification/request/telegram-multiple.dto';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import UserAddTelegramRequestMessageData from '../../../../libs/common/src/dto/notification-service/user-add-telegram/user-add-telegram.request';

const notificationQueue = 'notification_queue';
const notificationReplyQueue = 'notification_queue.reply';

@Injectable()
export class NotificationService {
  constructor(
    private readonly rabbitProducer: RabbitProducerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async addUser(dto: UserRegisteredDto): Promise<void> {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: notificationQueue,
      pattern: NotificationServiceMessagePattern.userRegistered,
      reply: {
        replyTo: notificationReplyQueue,
        correlationId: uuid,
      },
    });
  }

  async addUserTelegram(dto: UserAddTelegramDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: notificationQueue,
      pattern: NotificationServiceMessagePattern.userAddTelegram,
      reply: {
        replyTo: notificationReplyQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async mailSingle(dto: MailSingleDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: notificationQueue,
      pattern: NotificationServiceMessagePattern.mailSingle,
      reply: {
        replyTo: notificationReplyQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async mailMultiple(dto: MailMultipleDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: notificationQueue,
      pattern: NotificationServiceMessagePattern.mailMultiple,
      reply: {
        replyTo: notificationReplyQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async telegramSingle(dto: TelegramSingleDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: notificationQueue,
      pattern: NotificationServiceMessagePattern.telegramSingle,
      reply: {
        replyTo: notificationReplyQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async telegramMultiple(dto: TelegramMultipleDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: notificationQueue,
      pattern: NotificationServiceMessagePattern.telegramMultiple,
      reply: {
        replyTo: notificationReplyQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }
}
