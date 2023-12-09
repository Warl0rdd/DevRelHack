import { Inject, Injectable, Logger } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { Channel } from 'amqplib';
import {
  PROVIDE_CONNECTION_STRING,
  PROVIDE_REPLY_QUEUES,
} from './rabbit-client.const';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.init(connectionString, replyQueues);
  }

  public async subscribeToReplyQueue(queue: string) {
    await this.consumerChannel.consume(
      queue,
      (msg) => {
        Logger.verbose(
          `Received message: ${msg.content}. Queue: ${queue}. Correlation id: ${msg.properties.correlationId}`,
        );
        this.eventEmitter.emit(
          msg.properties.correlationId,
          msg.content.toString(),
        );
      },
      {
        noAck: true,
      },
    );
    Logger.verbose(`Subscribed to reply queue: ${queue}`);
  }
}
