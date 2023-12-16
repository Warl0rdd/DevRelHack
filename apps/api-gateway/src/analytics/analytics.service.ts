import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RabbitProducerService } from '../../../../libs/rabbit-producer/src';
import {
  AuthServiceMessagePattern,
  QueueName,
} from '../../../../libs/common/src';
import GetPositionAnalyticsResponseMessageData from '../../../../libs/common/src/dto/auth-service/get-position-analytics/get-position-analytics.response.message-data';
import RMQResponseMessageTemplate from '../../../../libs/common/src/dto/common/rmq.response.message-template';
import GetMostPopularTagsResponseMessageData from '../../../../libs/common/src/dto/auth-service/get-most-popular-tags/get-most-popular-tags.response.message-data';

@Injectable()
export default class AnalyticsService {
  constructor(
    private readonly rabbitProducer: RabbitProducerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getUserAnalytics(): Promise<
    RMQResponseMessageTemplate<GetPositionAnalyticsResponseMessageData>
  > {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: {},
      queue: QueueName.auth_queue,
      pattern: AuthServiceMessagePattern.getUserAnalytics,
      reply: {
        replyTo: QueueName.auth_queue_reply,
        correlationId: uuid,
      },
    });

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  async getMostPopularTags(): Promise<
    RMQResponseMessageTemplate<GetMostPopularTagsResponseMessageData>
  > {
    const uuid = crypto.randomUUID();
    await this.rabbitProducer.produce({
      data: {},
      queue: QueueName.auth_queue,
      pattern: AuthServiceMessagePattern.getMostPopularTags,
      reply: {
        replyTo: QueueName.auth_queue_reply,
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
