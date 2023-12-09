import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const swaggerPostfix = 'api/swagger';
  const config = new DocumentBuilder()
    .setTitle('Auth Swagger')
    .setDescription('Auth api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPostfix, app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

  const url = await app.getUrl();
  Logger.verbose(`Application: ${url}`);
  Logger.verbose(`Swagger: ${url}/${swaggerPostfix}`);
}
bootstrap();
