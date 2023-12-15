import { Injectable } from '@nestjs/common';
import {RabbitProducerService} from "@app/rabbit-producer";
import {EventEmitter2} from "@nestjs/event-emitter";
import ArticleOnModeration from "./db/entities/article.on-moderation";
import RMQResponseMessageTemplate from "@app/common/dto/common/rmq.response.message-template";
import AddArticleRequestMessageData from "@app/common/dto/wiki-service/create-article/add-article.request.message-data";
import AddArticleResponseMessageData
  from "@app/common/dto/wiki-service/create-article/add-article.response.message-data";

@Injectable()
export class WikiService {
  constructor(
      private readonly producer: RabbitProducerService,
      private readonly emitter: EventEmitter2
  ) {}

  async addArticle(dto: AddArticleRequestMessageData): Promise<RMQResponseMessageTemplate<AddArticleResponseMessageData>> {
    let article = new ArticleOnModeration();
    article.title = dto.title;
    article.body = dto.body;
    article.tags = dto.tags;
    return article.save()
        .then((saved) => {
          return {
            success: true,
            data: {
              id: saved.id,
              title: saved.title,
              body: saved.body,
              tags: saved.tags
            }
          }
        })
        .catch((err) => {
          return {
            success: false,
            error: {
              message: err,
              statusCode: 400
            }
          }
        })
  }
}
