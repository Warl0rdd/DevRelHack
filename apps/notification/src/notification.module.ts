import { Module } from '@nestjs/common';
import EmailModule from './email/email.module';
import TelegramModule from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './db/entities/user.entity';
import { typeormConfig } from './config/typeorm.config';
import { RabbitReplyConsumerModule } from '../../../libs/rabbit-reply-consumer/src';
import { RabbitProducerModule } from '../../../libs/rabbit-producer/src';
import TelegramAccount from './db/entities/telegram-account.entity';
import UserModule from './user/user.module';

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
          entities: [User, TelegramAccount],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    RabbitReplyConsumerModule.forRoot(`amqp://user:password@localhost:5672`, [
      'notification_queue.reply',
    ]),
    RabbitProducerModule.forRoot(`amqp://user:password@localhost:5672`),
    EmailModule,
    TelegramModule,
    UserModule,
  ],
})
export class NotificationModule {}
