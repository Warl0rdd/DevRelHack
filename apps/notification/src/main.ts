import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  const swaggerPostfix = 'api/swagger';
  const config = new DocumentBuilder()
    .setTitle('Auth Swagger')
    .setDescription('Notification api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPostfix, app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3001);

  const url = await app.getUrl();
  Logger.verbose(`Application: ${url}`);
  Logger.verbose(`Swagger: ${url}/${swaggerPostfix}`);
}

bootstrap();
