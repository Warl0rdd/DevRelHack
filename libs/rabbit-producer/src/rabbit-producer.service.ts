import { Inject, Injectable } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { Channel } from 'amqplib';
import { randomUUID } from 'crypto';
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

  public async produce(data: string, queue: string, replyTo?: string) {
    const dataBuffer = Buffer.from(data);
    if (replyTo) {
      const correlationId = randomUUID();
      return this.producerChannel.sendToQueue(queue, dataBuffer, {
        correlationId: correlationId,
        replyTo,
      });
    } else {
      return this.producerChannel.sendToQueue(queue, dataBuffer);
    }
  }
}
