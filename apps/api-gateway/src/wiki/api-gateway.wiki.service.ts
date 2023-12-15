import {Injectable} from "@nestjs/common";
import {RabbitProducerService} from "@app/rabbit-producer";
import {EventEmitter2} from "@nestjs/event-emitter";
import crypto from "crypto";
import {QueueName} from "@app/common";
import {WikiServiceMessagePattern} from "@app/common/enum/wiki-service.message-pattern.enum";
import AddArticleRequestDto from "../dto/wiki/add-article/add-article.request.dto";
import ApproveArticleRequestDto from "../dto/wiki/approve-article/approve-article.request.dto";
import RejectArticleRequestDto from "../dto/wiki/reject-article/reject-article.request.dto";
import GetArticlesByTagsRequestDto from "../dto/wiki/get-articles-by-tags/get-articles-by-tags.request.dto";

@Injectable()
export class ApiGatewayWikiService {
    constructor(
        private readonly rabbitProducer: RabbitProducerService,
        private readonly eventEmitter: EventEmitter2,
    ) {
    }

    // TODO: fix Cannot read properties of undefined (reading 'randomUUID')
    async addArticle(dto: AddArticleRequestDto) {
        const uuid = crypto.randomUUID();
        await this.rabbitProducer.produce({
            data: dto,
            queue: QueueName.wiki_queue,
            pattern: WikiServiceMessagePattern.addArticle,
            reply: {
                replyTo: QueueName.wiki_queue_reply,
                correlationId: uuid,
            },
        });

        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, async (data) => {
                resolve(JSON.parse(data));
            });
        });
    }

    async approveArticle(dto: ApproveArticleRequestDto) {
        const uuid = crypto.randomUUID();
        await this.rabbitProducer.produce({
            data: dto,
            queue: QueueName.wiki_queue,
            pattern: WikiServiceMessagePattern.approveArticle,
            reply: {
                replyTo: QueueName.wiki_queue_reply,
                correlationId: uuid,
            },
        });

        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, async (data) => {
                resolve(JSON.parse(data));
            });
        });
    }

    async rejectArticle(dto: RejectArticleRequestDto) {
        const uuid = crypto.randomUUID();
        await this.rabbitProducer.produce({
            data: dto,
            queue: QueueName.wiki_queue,
            pattern: WikiServiceMessagePattern.rejectArticle,
            reply: {
                replyTo: QueueName.wiki_queue_reply,
                correlationId: uuid,
            },
        });

        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, async (data) => {
                resolve(JSON.parse(data));
            });
        });
    }

    async getArticlesByTags(dto: GetArticlesByTagsRequestDto) {
        const uuid = crypto.randomUUID();
        await this.rabbitProducer.produce({
            data: dto,
            queue: QueueName.wiki_queue,
            pattern: WikiServiceMessagePattern.getArticlesByTags,
            reply: {
                replyTo: QueueName.wiki_queue_reply,
                correlationId: uuid,
            },
        });

        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, async (data) => {
                resolve(JSON.parse(data));
            });
        });
    }
}