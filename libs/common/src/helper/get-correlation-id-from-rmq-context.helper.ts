import { RmqContext } from '@nestjs/microservices';

export function getCorrelationIdFromRMQContext(context: RmqContext) {
  return context.getMessage().properties.correlationId;
}
