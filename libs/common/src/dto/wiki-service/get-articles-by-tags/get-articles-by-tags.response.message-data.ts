import Article from "../../../../../../apps/wiki/src/db/entities/article";

export default class GetArticlesByTagsResponseMessageData {
    articles: Map<string, Article[]>;
}