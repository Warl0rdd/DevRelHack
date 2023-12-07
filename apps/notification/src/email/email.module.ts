import { Module } from '@nestjs/common';
import EmailController from './email.controller';
import EmailService from './email.service';
import { HttpModule } from '@nestjs/axios';
import { unisenderConfig } from '../config/unisender.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule.register(unisenderConfig())],
  controllers: [EmailController],
  providers: [EmailService],
})
export default class EmailModule {}
