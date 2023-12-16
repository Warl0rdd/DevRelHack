import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import WikiConsumer from "./wiki.consumer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {typeormConfig} from "./config/typeorm.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import User from "../../auth/src/db/entities/user.entity";
import {RabbitProducerModule} from "@app/rabbit-producer";

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: '.env.wiki',
        load: [typeormConfig]
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
  controllers: [WikiConsumer],
  providers: [WikiService],
})
export class WikiModule {}
