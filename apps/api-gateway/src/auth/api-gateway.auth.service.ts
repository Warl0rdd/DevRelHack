import {Injectable, Logger} from '@nestjs/common';
import {RabbitProducerService} from "@app/rabbit-producer";
import {DirectReplyConsumerService} from "@app/rabbit-reply-consumer";
import RegistrationDto from "../dto/auth/registration.dto";
import * as crypto from "crypto";
import {EventEmitter2} from "@nestjs/event-emitter";

@Injectable()
export class ApiGatewayAuthService {

  constructor(private readonly rabbitProducer: RabbitProducerService,
              private readonly rabbitConsumer: DirectReplyConsumerService,
              private readonly eventEmitter: EventEmitter2,) {}
    async register(dto: RegistrationDto) {
      Logger.verbose(`Got request: email: ${dto.email}, pass: ${dto.password}`)
      const uuid = crypto.randomUUID()
      await this.rabbitProducer.produce({data: dto,
          queue: 'auth_queue',
        pattern: 'register',
          reply:
              {replyTo: 'auth_queue.reply',
                correlationId: uuid}})

      // TODO: fix text/html header
      // TODO: set timeout for errors
      return new Promise((resolve, reject) => {
        this.eventEmitter.once(uuid, async (data) => {
          resolve(data)
        })
      })
    }
}
