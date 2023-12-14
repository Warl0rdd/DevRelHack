import { Module } from '@nestjs/common';
import { ApiGatewayAuthController } from './api-gateway.auth.controller';
import { ApiGatewayAuthService } from './api-gateway.auth.service';
import { RabbitProducerModule } from '@app/rabbit-producer';
import { RabbitReplyConsumerModule } from '@app/rabbit-reply-consumer';
import { NotificationModule } from '../notification/api-gateway.notifictaion.module';

@Module({
  imports: [
    RabbitProducerModule.forRoot('amqp://user:password@localhost:5672'),
    RabbitReplyConsumerModule.forRoot('amqp://user:password@localhost:5672', [
      'auth_queue.reply',
    ]),
    NotificationModule,
  ],
  controllers: [ApiGatewayAuthController],
  providers: [ApiGatewayAuthService],
})
export class ApiGatewayAuthModule {}
