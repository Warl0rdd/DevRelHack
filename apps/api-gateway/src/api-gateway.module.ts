import { Module } from '@nestjs/common';
import { ApiGatewayAuthModule } from './auth/api-gateway.auth.module';
import { ConfigModule } from '@nestjs/config';
import UserModule from './users/user.module';
import {ApiGatewayWikiModule} from "./wiki/api-gateway.wiki.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ApiGatewayAuthModule,
    UserModule,
    ApiGatewayWikiModule
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
