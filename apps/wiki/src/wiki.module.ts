import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import WikiConsumer from "./wiki.consumer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {typeormConfig} from "./config/typeorm.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RabbitProducerModule} from "@app/rabbit-producer";
import Article from "./db/entities/article";
import ArticleOnModeration from "./db/entities/article.on-moderation";

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
          return { ...dbConfig, entities: [Article, ArticleOnModeration], synchronize: true };
        },
        inject: [ConfigService],
      }),
      RabbitProducerModule.forRoot('amqp://user:password@localhost:5672')
  ],
  controllers: [WikiConsumer],
  providers: [WikiService],
})
export class WikiModule {}
