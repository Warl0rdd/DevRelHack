import { Module } from '@nestjs/common';
import { RabbitProducerModule } from '@app/rabbit-producer';
import { RabbitReplyConsumerModule } from '@app/rabbit-reply-consumer';
import {ApiGatewayWikiController} from "./api-gateway.wiki.controller";
import {ApiGatewayWikiService} from "./api-gateway.wiki.service";
import {QueueName} from "@app/common";

@Module({
    imports: [
        RabbitProducerModule.forRoot('amqp://user:password@localhost:5672'),
        RabbitReplyConsumerModule.forRoot('amqp://user:password@localhost:5672', [
            QueueName.wiki_queue_reply,
        ]),
    ],
    controllers: [ApiGatewayWikiController],
    providers: [ApiGatewayWikiService],
})
export class ApiGatewayWikiModule {}
