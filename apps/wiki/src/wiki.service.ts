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
import GetArticlesByTagsRequestMessageData
  from "@app/common/dto/wiki-service/get-articles-by-tags/get-articles-by-tags.request.message-data";
import GetArticlesByTagsResponseMessageData
  from "@app/common/dto/wiki-service/get-articles-by-tags/get-articles-by-tags.response.message-data";
import DeleteArticleRequestMessageData
  from "@app/common/dto/wiki-service/delete-article/delete-article.request.message-data";
import GetArticlesOnModerationRequestMessageData
  from "@app/common/dto/wiki-service/get-articles-on-moderation/get-articles-on-moderation.request.message-data";
import GetArticlesOnModerationResponseMessageData
  from "@app/common/dto/wiki-service/get-articles-on-moderation/get-articles-on-moderation.response.message-data";
import GetArticlesRequestMessageData from "@app/common/dto/wiki-service/get-articles/get-articles.request.message-data";
import GetArticlesResponseMessageData
  from "@app/common/dto/wiki-service/get-articles/get-articles.response.message-data";
import GetArticlesByNameRequestMessageData
  from "@app/common/dto/wiki-service/get-articles-by-name/get-articles-by-name.request.message-data";
import GetArticlesByNameResponseMessageData
  from "@app/common/dto/wiki-service/get-articles-by-name/get-articles-by-name.response.message-data";

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

  async getArticlesByTags(dto: GetArticlesByTagsRequestMessageData):
      Promise<RMQResponseMessageTemplate<GetArticlesByTagsResponseMessageData>> {
    let articles: Map<string, Article[]>;
    for (const tag of dto.tags) {
      articles.set(tag, await Article.createQueryBuilder('articles')
          .select()
          .where(":tag = ANY(tags)", {tag: tag})
          .getMany());
    }
    return {
      success: true,
      data: {
        articles: articles
      }
    }
  }

  async deleteArticle(dto: DeleteArticleRequestMessageData): Promise<RMQResponseMessageTemplate<any>> {
    return Article.createQueryBuilder('articles')
        .delete()
        .from(Article)
        .where("id - :id", {id: dto.id})
        .execute()
        .then(() => {
          return {
            success: true,
          }
        })
        .catch(err => {
          return {
            success: false,
            error: {
              message: err,
              statusCode: 400
            }
          }
        })
  }

  async getArticlesOnModeration(dto: GetArticlesOnModerationRequestMessageData):
    Promise<RMQResponseMessageTemplate<GetArticlesOnModerationResponseMessageData>> {
    let end = dto.start + dto.max
    return ArticleOnModeration
        .createQueryBuilder('on_moderation')
        .select()
        .where('id >= :start AND id <= :end', {start: dto.start, end: end})
        .getMany()
        .then(async (articles) => {
          return {
            success: true,
            data: {
              articles: articles,
              total: await ArticleOnModeration.count()
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

  async getArticles(dto: GetArticlesRequestMessageData):
      Promise<RMQResponseMessageTemplate<GetArticlesResponseMessageData>> {
    let end = dto.start + dto.max
    return Article
        .createQueryBuilder('articles')
        .select()
        .where('id >= :start AND id <= :end', {start: dto.start, end: end})
        .getMany()
        .then(async (articles) => {
          return {
            success: true,
            data: {
              articles: articles,
              total: await ArticleOnModeration.count()
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

  async getArticlesByName(dto: GetArticlesByNameRequestMessageData):
      Promise<RMQResponseMessageTemplate<GetArticlesByNameResponseMessageData>> {
     return Article
         .createQueryBuilder('articles')
         .select()
         .where(':name IN title', {name: dto.name})
         .getMany()
         .then((articles) => {
           return {
             success: true,
             data: {
               articles: articles
             }
           }
         })
         .catch(err => {
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
