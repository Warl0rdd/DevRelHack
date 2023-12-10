import { NestFactory } from '@nestjs/core';
import { ApiGatewayAuthModule } from './auth/api-gateway.auth.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayAuthModule);
  await app.listen(3000);
}
bootstrap();
