import { Module } from '@nestjs/common';
import DirectReplyController from './direct-reply.controller';

@Module({
  imports: [],
  controllers: [DirectReplyController],
})
export class DirectReplyModule {}
