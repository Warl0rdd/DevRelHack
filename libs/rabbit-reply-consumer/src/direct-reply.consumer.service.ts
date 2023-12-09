import { Inject, Injectable, Logger } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { Channel } from 'amqplib';
import {
  PROVIDE_CONNECTION_STRING,
  PROVIDE_REPLY_QUEUES,
} from './rabbit-client.const';

@Injectable()
export class DirectReplyConsumerService {
  private consumerChannel: Channel;

  public async init(connectionString: string, replyQueues: string[]) {
    const conn = await amqplib.connect(connectionString);
    const consumerChannel = await conn.createChannel();
    this.consumerChannel = consumerChannel;
    for (const queue of replyQueues) {
      await this.subscribeToReplyQueue(queue);
    }
  }

  constructor(
    @Inject(PROVIDE_REPLY_QUEUES) replyQueues: string[],
    @Inject(PROVIDE_CONNECTION_STRING)
    connectionString: string,
  ) {
    this.init(connectionString, replyQueues);
  }

  public async subscribeToReplyQueue(queue: string) {
    await this.consumerChannel.consume(
      queue,
      (msg) => {
        console.log('received reply on request');
        console.log(msg.content);
      },
      {
        noAck: true,
      },
    );
    Logger.verbose(`Subscribed to reply queue: ${queue}`);
  }
}
