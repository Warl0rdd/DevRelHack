import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const user = 'user';
  const password = 'password';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@localhost:5672`],
        queue: 'notification_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
}

bootstrap();
