import { RmqContext } from '@nestjs/microservices';

export function getReplyToFromRMQContext(context: RmqContext): string {
  return context.getMessage().properties.replyTo;
}
