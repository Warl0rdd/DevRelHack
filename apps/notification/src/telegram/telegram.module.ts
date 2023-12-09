import { Module } from '@nestjs/common';
import TelegramService from './telegram.service';
import TelegramConsumer from './telegram.consumer';

@Module({
  imports: [],
  controllers: [TelegramConsumer],
  providers: [TelegramService],
})
export default class TelegramModule {}
