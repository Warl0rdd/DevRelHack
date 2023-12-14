import { NestFactory } from '@nestjs/core';
import { WikiModule } from './wiki.module';

async function bootstrap() {
  const app = await NestFactory.create(WikiModule);
  await app.listen(3000);
}
bootstrap();
