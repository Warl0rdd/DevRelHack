import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
import { WikiModule } from './wiki.module';
config({
  path: '.env.wiki',
});

async function bootstrap() {
  const user = 'user';
  const password = 'password';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WikiModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@localhost:5672`],
        queue: 'auth_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
