import { NestFactory } from '@nestjs/core';
import { ApiGatewayAuthModule } from './auth/api-gateway.auth.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayAuthModule);

  const swaggerPostfix = 'swagger';
  const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('Auth api + Notification (not implemented yet)')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPostfix, app, document);

  await app.listen(3000);

  const url = await app.getUrl();
  Logger.verbose(`Swagger: ${url}/${swaggerPostfix}`);
  Logger.verbose(`Application: ${url}`);
}
bootstrap();
