import ArticleOnModeration from "../../../../../../apps/wiki/src/db/entities/article.on-moderation";

export default class GetArticlesOnModerationResponseMessageData {
    articles: ArticleOnModeration[];
    total: number;
}