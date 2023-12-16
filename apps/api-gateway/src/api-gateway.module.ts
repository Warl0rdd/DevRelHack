import { Module } from '@nestjs/common';
import { ApiGatewayAuthModule } from './auth/api-gateway.auth.module';
import { ConfigModule } from '@nestjs/config';
import UserModule from './users/user.module';
import { ApiGatewayWikiModule } from './wiki/api-gateway.wiki.module';
import AnalyticsModule from './analytics/analytics.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ApiGatewayAuthModule,
    UserModule,
    ApiGatewayWikiModule,
    AnalyticsModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.FILE_PATH + '/files/',
      serveRoot: '/static',
      serveStaticOptions: {
        index: false,
      },
    }),
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
