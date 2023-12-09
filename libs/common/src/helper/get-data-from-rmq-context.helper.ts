import { RmqContext } from '@nestjs/microservices';

export function getDataFromRMQContext<T>(context: RmqContext): T {
  return JSON.parse((context.getMessage().content as Buffer).toString());
}
