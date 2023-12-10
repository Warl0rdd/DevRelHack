import {Controller, Logger} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RabbitProducerService} from "@app/rabbit-producer";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import RegistrationDto from "./dto/registration.dto";
import {getCorrelationIdFromRMQContext, getDataFromRMQContext} from "@app/common";

@Controller()
export default class AuthConsumer {
    replyQueue = 'auth_queue.reply'

    constructor(
        private readonly authService: AuthService,
        private readonly rabbitProducer: RabbitProducerService
    ) {}

    @MessagePattern('register')
    async register(@Ctx() ctx: RmqContext) {
        Logger.verbose(`Received message, data: ${getDataFromRMQContext(ctx)}`)
        this.authService.create(getDataFromRMQContext(ctx))
            .then((created) => {
                this.rabbitProducer.reply({
                    data: created,
                    replyQueue: this.replyQueue,
                    correlationId: getCorrelationIdFromRMQContext(ctx)
                })
            })
            .catch((err) => {
                Logger.error(err)
                this.rabbitProducer.reply({
                    data: err,
                    replyQueue: this.replyQueue,
                    correlationId: getCorrelationIdFromRMQContext(ctx)
                })
            })
    }
}