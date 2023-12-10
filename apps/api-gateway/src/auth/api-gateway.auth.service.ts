import {Injectable, Logger} from '@nestjs/common';
import {RabbitProducerService} from "@app/rabbit-producer";
import {DirectReplyConsumerService} from "@app/rabbit-reply-consumer";
import RegistrationDto from "../dto/auth/registration.dto";
import * as crypto from "crypto";
import {EventEmitter2} from "@nestjs/event-emitter";
import AddUserRequestMessageData from "@app/common/dto/auth-service/add-user/add-user.request.message-data";
import {AuthServiceMessagePattern} from "@app/common";

@Injectable()
export class ApiGatewayAuthService {

  constructor(private readonly rabbitProducer: RabbitProducerService,
              private readonly rabbitConsumer: DirectReplyConsumerService,
              private readonly eventEmitter: EventEmitter2,) {}
    async addUser(dto: AddUserRequestMessageData) {
      const uuid = crypto.randomUUID()
      await this.rabbitProducer.produce({
        data: dto,
        queue: 'auth_queue',
        pattern: AuthServiceMessagePattern.addUser,
        reply: {
          replyTo: 'auth_queue.reply',
          correlationId: uuid
        }})

      return new Promise((resolve) => {
        this.eventEmitter.once(uuid, async (data) => {
          resolve(JSON.parse(data))
        })
      })
    }
}
