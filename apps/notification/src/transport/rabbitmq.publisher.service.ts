import { Injectable } from '@nestjs/common';
import { Channel } from 'amqp-connection-manager';
import * as amqplib from 'amqplib';
import { NOTIFICATION_QUEUE_NAME } from './transport.queue.const';
import { randomUUID } from 'crypto';

@Injectable()
export default class RabbitmqPublisherService {
  // TODO: Remove hardcode
  private rabbitConnectionString = `amqp://user:password@localhost:5672`;
  private channel: Channel;

  constructor() {
    this.initConnection();
  }

  public async initConnection() {
    const conn = await amqplib.connect(this.rabbitConnectionString);
    const ch1 = await conn.createChannel();

    this.channel = ch1;

    await this.channel.consume(
      'amq.rabbitmq.reply-to',
      (msg) => {
        console.log('fast reply');
      },
      {
        noAck: true,
      },
    );
  }

  public async sendToQueue(queueName: string, pattern: string, data: Object) {
    const id = randomUUID();
    await this.channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ ...data, pattern })),
      {
        replyTo: 'amq.rabbitmq.reply-to',
        correlationId: id,
      },
    );
  }

  public async sendToNotificationQueue(pattern: string, data: Object) {
    await this.sendToQueue(NOTIFICATION_QUEUE_NAME, pattern, data);
  }

  public async sendToNotificationReplyQueue(pattern: string, data: Object) {
    await this.sendToQueue(NOTIFICATION_QUEUE_NAME, pattern, data);
  }
}
