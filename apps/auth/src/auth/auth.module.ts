import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import JwtModule from '../jwt/jwt.module';
import { typeormConfig } from '../config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from '../db/entities/user.entity';
import { jwtConfig } from '../config/jwt.config';
import AuthConsumer from './auth.consumer';
import { RabbitProducerModule } from '../../../../libs/rabbit-producer/src';
import TelegramCodeEntity from '../db/entities/telegram-code.entity';
import { RabbitReplyConsumerModule } from '../../../../libs/rabbit-reply-consumer/src';
import { QueueName } from '../../../../libs/common/src';
import TagEntity from '../db/entities/tags.entity';
import TagService from './tag.service';
import NotificationAdapterService from './notification.service';
import AnalyticsService from './analytics.service';
import WorkExperienceEntity from '../db/entities/work-experience.entity';

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({
      envFilePath: '.env.auth',
      load: [typeormConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('typeorm');
        return {
          ...dbConfig,
          entities: [
            UserEntity,
            TelegramCodeEntity,
            TagEntity,
            WorkExperienceEntity,
          ],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    RabbitProducerModule.forRoot('amqp://user:password@localhost:5672'),
    RabbitReplyConsumerModule.forRoot('amqp://user:password@localhost:5672', [
      QueueName.notification_to_auth_queue_reply,
    ]),
  ],
  controllers: [AuthConsumer],
  providers: [
    AuthService,
    TagService,
    NotificationAdapterService,
    AnalyticsService,
  ],
})
export class AuthModule {}
