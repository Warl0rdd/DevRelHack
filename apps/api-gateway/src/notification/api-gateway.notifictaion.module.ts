import { Module } from '@nestjs/common';
import { RabbitProducerModule } from '@app/rabbit-producer';
import { RabbitReplyConsumerModule } from '@app/rabbit-reply-consumer';
import { NotificationService } from './api-gateway.notification.service';
import { NotificationController } from './api-gateway.notification.controller';
import { QueueName } from '../../../../libs/common/src';

@Module({
  imports: [
    RabbitProducerModule.forRoot('amqp://user:password@localhost:5672'),
    RabbitReplyConsumerModule.forRoot('amqp://user:password@localhost:5672', [
      QueueName.notification_queue_reply,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
