import { Injectable } from '@nestjs/common';
import { RabbitProducerService } from '@app/rabbit-producer';
import * as crypto from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthServiceMessagePattern, QueueName } from '@app/common';
import LoginDto from '../../../auth/src/auth/dto/login.dto';
import RefreshTokenDto from '../dto/auth/request/refresh-token.dto';
import UpdateUserDto from '../dto/auth/request/update-user.dto';
import GetUserRequest from '../dto/auth/request/get-user.request';
import ChangePasswordRequestMessageData from '../../../../libs/common/src/dto/auth-service/change-password/change-password.request.message-data';
import UpdateUserRequestMessageData from '../../../../libs/common/src/dto/auth-service/update-user/update-user.request.message-data';
import SendTelegramCodeRequest from '../dto/auth/request/send-telegram-code.request';
import TelegramLoginRequestMessageData from '../../../../libs/common/src/dto/auth-service/telegram-login/telegram-login.request.message-data';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import TelegramLoginResponseMessageData from '../../../../libs/common/src/dto/auth-service/telegram-login/telegram-login.response.message-data';

const authQueue = 'auth_queue';
const replyAuthQueue = 'auth_queue.reply';

@Injectable()
export class ApiGatewayAuthService {
  constructor(
    private readonly rabbitProducer: RabbitProducerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async login(dto: LoginDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.login,
      reply: {
        replyTo: replyAuthQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async refreshToken(dto: RefreshTokenDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.refreshTokens,
      reply: {
        replyTo: replyAuthQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async getProfile(dto: GetUserRequest) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.getUser,
      reply: {
        replyTo: replyAuthQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async changePassword(dto: ChangePasswordRequestMessageData) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.changePassword,
      reply: {
        replyTo: replyAuthQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async updateProfile(dto: UpdateUserRequestMessageData) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.updateProfile,
      reply: {
        replyTo: replyAuthQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async sendTelegramCode(dto: SendTelegramCodeRequest) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: QueueName.auth_queue,
      pattern: AuthServiceMessagePattern.sendTelegramCode,
      reply: {
        replyTo: replyAuthQueue,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async telegramLogin(
    dto: TelegramLoginRequestMessageData,
  ): Promise<RMQResponseMessageTemplate<TelegramLoginResponseMessageData>> {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: QueueName.auth_queue,
      pattern: AuthServiceMessagePattern.telegramLogin,
      reply: {
        replyTo: replyAuthQueue,
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
