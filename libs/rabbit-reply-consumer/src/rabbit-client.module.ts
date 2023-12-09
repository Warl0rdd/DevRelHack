import { DynamicModule, Module } from '@nestjs/common';
import { DirectReplyConsumerService } from './direct-reply.consumer.service';
import {
  PROVIDE_CONNECTION_STRING,
  PROVIDE_REPLY_QUEUES,
} from './rabbit-client.const';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({})
export class RabbitReplyConsumerModule {
  public static forRoot(
    connectionString: string,
    replyQueues: string[],
  ): DynamicModule {
    return {
      module: RabbitReplyConsumerModule,
      imports: [EventEmitterModule.forRoot()],
      providers: [
        DirectReplyConsumerService,
        {
          provide: PROVIDE_REPLY_QUEUES,
          useValue: replyQueues,
        },
        {
          provide: PROVIDE_CONNECTION_STRING,
          useValue: connectionString,
        },
      ],
      exports: [DirectReplyConsumerService],
      global: true,
    };
  }
}
