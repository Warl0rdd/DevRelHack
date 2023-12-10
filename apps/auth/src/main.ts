import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AuthModule} from './auth/auth.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import {config} from 'dotenv';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AuthModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'auth_queue',
        },
      },
  )

  await app.listen();
}
bootstrap();
