import { Inject, Injectable } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { Channel } from 'amqplib';
import { PROVIDE_CONNECTION_STRING } from './rabbit-producer.const';

@Injectable()
export class RabbitProducerService {
  private producerChannel: Channel;

  public async init(connectionString: string) {
    const conn = await amqplib.connect(connectionString);
    const producerChannel = await conn.createChannel();
    this.producerChannel = producerChannel;
  }

  constructor(
    @Inject(PROVIDE_CONNECTION_STRING)
    connectionString: string,
  ) {
    this.init(connectionString);
  }

  public async produce(dto: {
    data: Object;
    queue: string;
    pattern: string;
    reply?: {
      replyTo: string;
      correlationId: string;
    };
  }) {
    const { reply, queue, pattern } = dto;
    const data = { ...dto.data, pattern: pattern ?? '' };
    const dataBuffer = Buffer.from(JSON.stringify(data));
    if (reply) {
      return this.producerChannel.sendToQueue(queue, dataBuffer, {
        correlationId: reply.correlationId,
        replyTo: reply.replyTo,
      });
    } else {
      return this.producerChannel.sendToQueue(queue, dataBuffer);
    }
  }

  public async reply(dto: {
    data: Object;
    replyQueue: string;
    correlationId: string;
  }) {
    const { replyQueue, correlationId, data } = dto;
    const dataBuffer = Buffer.from(JSON.stringify(data));

    return this.producerChannel.sendToQueue(replyQueue, dataBuffer, {
      correlationId,
    });
  }
}
