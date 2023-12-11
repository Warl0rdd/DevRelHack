import { Module } from '@nestjs/common';
import { ApiGatewayAuthModule } from './auth/api-gateway.auth.module';
import { ApiGatewayAuthController } from './auth/api-gateway.auth.controller';
import { ApiGatewayAuthService } from './auth/api-gateway.auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ApiGatewayAuthModule,
  ],
  controllers: [ApiGatewayAuthController],
  providers: [ApiGatewayAuthService],
})
export class ApiGatewayModule {}
