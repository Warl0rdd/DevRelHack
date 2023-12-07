import { Module } from '@nestjs/common';
import EmailModule from './email/email.module';
import TelegramModule from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './db/entities/user.entity';
import { typeormConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.notification',
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('typeorm');
        return {
          ...dbConfig,
          entities: [User],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    EmailModule,
    TelegramModule,
  ],
})
export class NotificationModule {}
