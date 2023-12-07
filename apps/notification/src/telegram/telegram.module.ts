import { Module } from '@nestjs/common';
import TelegramService from './telegram.service';
import TelegramConsumer from './telegram.consumer';
import RabbitmqPublisherService from '../transport/rabbitmq.publisher.service';

@Module({
  controllers: [TelegramConsumer],
  providers: [TelegramService, RabbitmqPublisherService],
})
export default class TelegramModule {}
