import {Controller} from "@nestjs/common";
import {WikiService} from "./wiki.service";
import {Ctx, MessagePattern, RmqContext} from "@nestjs/microservices";
import {WikiServiceMessagePattern} from "@app/common/enum/wiki-service.message-pattern.enum";
import {getCorrelationIdFromRMQContext, getDataFromRMQContext, getReplyToFromRMQContext} from "@app/common";
import AddArticleRequestMessageData from "@app/common/dto/wiki-service/create-article/add-article.request.message-data";
import {RabbitProducerService} from "@app/rabbit-producer";
import ApproveArticleRequestMessageData
    from "@app/common/dto/wiki-service/approve-article/approve-article.request.message-data";
import RejectArticleRequestMessageData
    from "@app/common/dto/wiki-service/reject-article/reject-article.request.message-data";

@Controller()
export default class WikiConsumer {
    constructor(
        private readonly wikiService: WikiService,
        private readonly producer: RabbitProducerService
    ) {}

    @MessagePattern(WikiServiceMessagePattern.addArticle)
    public async addArticle(@Ctx() ctx: RmqContext) {
        const data = getDataFromRMQContext<AddArticleRequestMessageData>(ctx)
        const article = await this.wikiService.addArticle(data)

        const replyTo = getReplyToFromRMQContext(ctx)
        if (!replyTo) return

        const correlationId = getCorrelationIdFromRMQContext(ctx)
        await this.producer.reply({
            data: article,
            correlationId: correlationId,
            replyQueue: replyTo
        })
    }

    @MessagePattern(WikiServiceMessagePattern.approveArticle)
    public async approveArticle(@Ctx() ctx: RmqContext) {
        const data = getDataFromRMQContext<ApproveArticleRequestMessageData>(ctx);
        const article = await this.wikiService.approveArticle(data);

        const replyTo = getReplyToFromRMQContext(ctx)
        if (!replyTo) return

        const correlationId = getCorrelationIdFromRMQContext(ctx)
        await this.producer.reply({
            data: article,
            correlationId: correlationId,
            replyQueue: replyTo
        })
    }

    @MessagePattern(WikiServiceMessagePattern.rejectArticle)
    public async rejectArticle(@Ctx() ctx: RmqContext) {
        const data = getDataFromRMQContext<RejectArticleRequestMessageData>(ctx);
        const article = await this.wikiService.rejectArticle(data);

        const replyTo = getReplyToFromRMQContext(ctx)
        if (!replyTo) return

        const correlationId = getCorrelationIdFromRMQContext(ctx)
        await this.producer.reply({
            data: article,
            correlationId: correlationId,
            replyQueue: replyTo
        })
    }
}