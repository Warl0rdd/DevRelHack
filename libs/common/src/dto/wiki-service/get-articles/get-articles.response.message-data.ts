import Article from "../../../../../../apps/wiki/src/db/entities/article";

export default class GetArticlesResponseMessageData {
    articles: Article[];
    total: number;
}