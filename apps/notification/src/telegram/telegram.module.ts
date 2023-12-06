import { Module } from '@nestjs/common';
import TelegramService from './telegram.service';

@Module({
  providers: [TelegramService],
})
export default class TelegramModule {}
