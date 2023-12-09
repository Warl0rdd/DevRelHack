import { Module } from '@nestjs/common';
import EmailService from './email.service';
import { HttpModule } from '@nestjs/axios';
import { unisenderConfig } from '../config/unisender.config';
import EmailConsumer from './email.consumer';

@Module({
  imports: [HttpModule.register(unisenderConfig())],
  controllers: [EmailConsumer],
  providers: [EmailService],
})
export default class EmailModule {}
