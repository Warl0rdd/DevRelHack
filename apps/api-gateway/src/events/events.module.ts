import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeormConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import EventEntity from './db/entities/event';
import SpeakerEntity from './db/entities/speaker';
import TimelineEntity from './db/entities/timeline';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dbconfig = config.get('typeorm');
        return {
          ...dbconfig,
          entities: [EventEntity, SpeakerEntity, TimelineEntity],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
