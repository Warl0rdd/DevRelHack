import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { ApiGatewayModule } from './api-gateway.module';
config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const swaggerPostfix = 'swagger';
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Auth api + Notification (not implemented yet)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPostfix, app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

  const url = await app.getUrl();
  Logger.verbose(`Swagger: ${url}/${swaggerPostfix}`);
  Logger.verbose(`Application: ${url}`);
}
bootstrap();
