import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import JwtModule from '../jwt/jwt.module';
import { typeormConfig } from '../config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../db/entities/user.entity';
import { jwtConfig } from '../config/jwt.config';
import {RabbitProducerModule} from "@app/rabbit-producer";
import {RabbitReplyConsumerModule} from "@app/rabbit-reply-consumer";
import AuthConsumer from "./auth.consumer";

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [typeormConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('typeorm');
        return { ...dbConfig, entities: [User], synchronize: true };
      },
      inject: [ConfigService],
    }),
    RabbitProducerModule.forRoot('amqp://user:password@localhost:5672')
  ],
  controllers: [AuthConsumer],
  providers: [AuthService],
})
export class AuthModule {}
