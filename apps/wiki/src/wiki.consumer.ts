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
import GetArticlesByTagsRequestMessageData
    from "@app/common/dto/wiki-service/get-articles-by-tags/get-articles-by-tags.request.message-data";
import DeleteArticleRequestMessageData
    from "@app/common/dto/wiki-service/delete-article/delete-article.request.message-data";
import GetArticlesOnModerationRequestMessageData
    from "@app/common/dto/wiki-service/get-articles-on-moderation/get-articles-on-moderation.request.message-data";
import GetArticlesRequestMessageData from "@app/common/dto/wiki-service/get-articles/get-articles.request.message-data";
import GetArticlesByNameRequestMessageData
    from "@app/common/dto/wiki-service/get-articles-by-name/get-articles-by-name.request.message-data";

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

    @MessagePattern(WikiServiceMessagePattern.getArticlesByTags)
    public async getArticlesByTags(@Ctx() ctx: RmqContext) {
        const data = getDataFromRMQContext<GetArticlesByTagsRequestMessageData>(ctx);
        const article = await this.wikiService.getArticlesByTags(data);

        const replyTo = getReplyToFromRMQContext(ctx)
        if (!replyTo) return

        const correlationId = getCorrelationIdFromRMQContext(ctx)
        await this.producer.reply({
            data: article,
            correlationId: correlationId,
            replyQueue: replyTo
        })
    }

    @MessagePattern(WikiServiceMessagePattern.deleteArticle)
    public async deleteArticle(@Ctx() ctx: RmqContext) {
        const data = getDataFromRMQContext<DeleteArticleRequestMessageData>(ctx);
        const article = await this.wikiService.deleteArticle(data);

        const replyTo = getReplyToFromRMQContext(ctx)
        if (!replyTo) return

        const correlationId = getCorrelationIdFromRMQContext(ctx)
        await this.producer.reply({
            data: article,
            correlationId: correlationId,
            replyQueue: replyTo
        })
    }

    @MessagePattern(WikiServiceMessagePattern.getArticlesOnModeration)
    public async getArticlesOnModeration(@Ctx() ctx: RmqContext) {
        const data = getDataFromRMQContext<GetArticlesOnModerationRequestMessageData>(ctx);
        const article = await this.wikiService.getArticlesOnModeration(data);

        const replyTo = getReplyToFromRMQContext(ctx)
        if (!replyTo) return

        const correlationId = getCorrelationIdFromRMQContext(ctx)
        await this.producer.reply({
            data: article,
            correlationId: correlationId,
            replyQueue: replyTo
        })
    }

    @MessagePattern(WikiServiceMessagePattern.getArticles)
    public async getArticles(@Ctx() ctx: RmqContext) {
        const data = getDataFromRMQContext<GetArticlesRequestMessageData>(ctx);
        const article = await this.wikiService.getArticles(data);

        const replyTo = getReplyToFromRMQContext(ctx)
        if (!replyTo) return

        const correlationId = getCorrelationIdFromRMQContext(ctx)
        await this.producer.reply({
            data: article,
            correlationId: correlationId,
            replyQueue: replyTo
        })
    }

    @MessagePattern(WikiServiceMessagePattern.getArticlesByName)
    public async getArticlesByName(@Ctx() ctx: RmqContext) {
        const data = getDataFromRMQContext<GetArticlesByNameRequestMessageData>(ctx);
        const article = await this.wikiService.getArticlesByName(data);

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