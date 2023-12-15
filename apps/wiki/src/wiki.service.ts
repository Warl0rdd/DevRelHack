import {Injectable} from '@nestjs/common';
import ArticleOnModeration from "./db/entities/article.on-moderation";
import RMQResponseMessageTemplate from "@app/common/dto/common/rmq.response.message-template";
import AddArticleRequestMessageData from "@app/common/dto/wiki-service/create-article/add-article.request.message-data";
import AddArticleResponseMessageData
  from "@app/common/dto/wiki-service/create-article/add-article.response.message-data";
import ApproveArticleRequestMessageData
  from "@app/common/dto/wiki-service/approve-article/approve-article.request.message-data";
import ApproveArticleResponseMessageData
  from "@app/common/dto/wiki-service/approve-article/approve-article.response.message-data";
import Article from "./db/entities/article";
import {ArticleStatus} from "@app/common/enum/wiki-service.article-status.enum";
import RejectArticleRequestMessageData
  from "@app/common/dto/wiki-service/reject-article/reject-article.request.message-data";
import RejectArticleResponseMessageData
  from "@app/common/dto/wiki-service/reject-article/reject-article.response.message-data";
import {DateTime} from "luxon";

@Injectable()
export class WikiService {
  constructor() {}

  async addArticle(dto: AddArticleRequestMessageData): Promise<RMQResponseMessageTemplate<AddArticleResponseMessageData>> {
    let article = new ArticleOnModeration();
    article.title = dto.title;
    article.body = dto.body;
    article.tags = dto.tags;
    article.author_email = dto.author_email;
    return article.save()
        .then((saved) => {
          return {
            success: true,
            data: {
              id: saved.id,
              title: saved.title,
              body: saved.body,
              tags: saved.tags,
              author_email: saved.author_email,
              created: saved.created
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
        });
  }

  async approveArticle(dto: ApproveArticleRequestMessageData): Promise<RMQResponseMessageTemplate<ApproveArticleResponseMessageData>> {
    let articleOnModeration = await ArticleOnModeration.findOne({where: {
        id: dto.id
      }});
    articleOnModeration.status = ArticleStatus.approved;
    await articleOnModeration.save();

    let article = new Article();
    article.title = articleOnModeration.title;
    article.body = articleOnModeration.body;
    article.tags = articleOnModeration.tags;
    article.author_email = articleOnModeration.author_email;
    article.approved_by = dto.approved_by;
    article.created = articleOnModeration.created;

    return article.save()
        .then((saved) => {
          return {
            success: true,
            data: {
              id: saved.id,
              title: saved.title,
              body: saved.body,
              tags: saved.tags,
              author_email: saved.author_email,
              approved_by: saved.approved_by,
              created: saved.created,
              published: saved.published
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
        });
  }

  async rejectArticle(dto: RejectArticleRequestMessageData): Promise<RMQResponseMessageTemplate<RejectArticleResponseMessageData>>  {
    let articleOnModeration = await ArticleOnModeration.findOne({where: {
        id: dto.id
      }});
    articleOnModeration.status = ArticleStatus.rejected;
    return articleOnModeration.save()
        .then((saved) => {
          return {
            success: true,
            data: {
              id: saved.id,
              title: saved.title,
              body: saved.body,
              tags: saved.tags,
              author_email: saved.author_email,
              rejected_by: dto.rejected_by,
              rejected_at: DateTime.now().toISOTime(),
              created: saved.created
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
        });
  }
}
