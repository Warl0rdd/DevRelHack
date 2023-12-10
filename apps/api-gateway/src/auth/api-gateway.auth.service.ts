import {Injectable} from '@nestjs/common';
import {RabbitProducerService} from "@app/rabbit-producer";
import * as crypto from "crypto";
import {EventEmitter2} from "@nestjs/event-emitter";
import AddUserRequestMessageData from "@app/common/dto/auth-service/add-user/add-user.request.message-data";
import {AuthServiceMessagePattern} from "@app/common";
import AddUserMultipleDto from "../dto/auth/request/add-user-multiple.dto";
import BlockUserDto from "../dto/auth/request/block-user.dto";

const authQueue = 'auth_queue'
const replyAuthQueue = 'auth_queue.reply'

@Injectable()
export class ApiGatewayAuthService {

  constructor(private readonly rabbitProducer: RabbitProducerService,
              private readonly eventEmitter: EventEmitter2) {}

    async addUser(dto: AddUserRequestMessageData) {
      const uuid = crypto.randomUUID()
      await this.rabbitProducer.produce({
        data: dto,
        queue: authQueue,
        pattern: AuthServiceMessagePattern.addUser,
        reply: {
          replyTo: replyAuthQueue,
          correlationId: uuid
        }})

      return new Promise((resolve) => {
        this.eventEmitter.once(uuid, async (data) => {
          resolve(JSON.parse(data))
        })
      })
    }

    async addUserMultiple(dto: AddUserMultipleDto) {
      const uuid = crypto.randomUUID()
      await this.rabbitProducer.produce({
        data: dto,
        queue: authQueue,
        pattern: AuthServiceMessagePattern.addUserMultiple,
        reply: {
          replyTo: replyAuthQueue,
          correlationId: uuid
        }})

      return new Promise((resolve) => {
        this.eventEmitter.once(uuid, async (data) => {
          resolve(JSON.parse(data))
        })
      })
    }

    async blockUser(dto: BlockUserDto) {
      const uuid = crypto.randomUUID()
      await this.rabbitProducer.produce({
        data: dto,
        queue: authQueue,
        pattern: AuthServiceMessagePattern.addUserMultiple,
        reply: {
          replyTo: replyAuthQueue,
          correlationId: uuid
        }})
    }
}
