import { DynamicModule, Module } from '@nestjs/common';
import { RabbitProducerService } from './rabbit-producer.service';
import { PROVIDE_CONNECTION_STRING } from './rabbit-producer.const';

@Module({})
export class RabbitProducerModule {
  public static forRoot(connectionString: string): DynamicModule {
    return {
      module: RabbitProducerModule,
      providers: [
        RabbitProducerService,
        {
          provide: PROVIDE_CONNECTION_STRING,
          useValue: connectionString,
        },
      ],
      exports: [RabbitProducerService],
      global: true,
    };
  }
}
