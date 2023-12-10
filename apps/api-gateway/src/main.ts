import { NestFactory } from '@nestjs/core';
import { ApiGatewayAuthModule } from './auth/api-gateway.auth.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayAuthModule);
  await app.listen(3000);

  const swaggerPostfix = 'api/swagger';
  const config = new DocumentBuilder()
      .setTitle('Auth Swagger')
      .setDescription('Auth api')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPostfix, app, document);

  const url = await app.getUrl();
  Logger.verbose(`Swagger: ${url}/${swaggerPostfix}`);
  Logger.verbose(`Application: ${url}`);
}
bootstrap();
