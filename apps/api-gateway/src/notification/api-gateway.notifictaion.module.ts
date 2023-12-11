import {Module} from "@nestjs/common";
import {RabbitProducerModule} from "@app/rabbit-producer";
import {RabbitReplyConsumerModule} from "@app/rabbit-reply-consumer";
import {ApiGatewayNotificationService} from "./api-gateway.notification.service";
import {ApiGatewayNotificationController} from "./api-gateway.notification.controller";

@Module({
    imports: [
        RabbitProducerModule.forRoot('amqp://user:password@localhost:5672'),
        RabbitReplyConsumerModule.forRoot('amqp://user:password@localhost:5672', [
            'auth_queue.reply'
        ])
    ],
    controllers: [ApiGatewayNotificationController],
    providers: [ApiGatewayNotificationService],
    exports: [ApiGatewayAuthModule]
})
export class ApiGatewayAuthModule {}