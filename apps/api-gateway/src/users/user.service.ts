import { Injectable } from '@nestjs/common';
import { RabbitProducerService } from '@app/rabbit-producer';
import * as crypto from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import AddUserRequestMessageData from '@app/common/dto/auth-service/add-user/add-user.request.message-data';
import { AuthServiceMessagePattern } from '@app/common';
import AddUserMultipleDto from '../dto/auth/request/add-user-multiple.dto';
import BlockUserDto from '../dto/auth/request/block-user.dto';
import LoginDto from '../../../auth/src/auth/dto/login.dto';
import RefreshTokenDto from '../dto/auth/request/refresh-token.dto';
import UnBlockUserDto from '@app/common/dto/auth-service/unblock-user/unblock-user.request.message-data';
import UnblockUserDto from '../dto/auth/request/unblock-user.dto';
import UpdateUserDto from '../dto/auth/request/update-user.dto';
import GetUserRequest from '../dto/auth/request/get-user.request';
import ChangePasswordRequest from '../dto/auth/request/change-password.request';
import ChangePasswordRequestMessageData from '../../../../libs/common/src/dto/auth-service/change-password/change-password.request.message-data';

const authQueue = 'auth_queue';
const replyAuthQueue = 'auth_queue.reply';

@Injectable()
export class UserService {
  constructor(
    private readonly rabbitProducer: RabbitProducerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addUser(dto: AddUserRequestMessageData) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.addUser,
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

  async addUserMultiple(dto: AddUserMultipleDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.addUserMultiple,
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

  async blockUser(dto: BlockUserDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.blockUser,
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

  async unblockUser(dto: UnblockUserDto) {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: dto,
      queue: authQueue,
      pattern: AuthServiceMessagePattern.unblockUser,
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

  async updateUser(dto: UpdateUserDto) {
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

  async getUser(dto: GetUserRequest) {
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
}
