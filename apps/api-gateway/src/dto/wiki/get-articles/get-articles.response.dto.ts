import Article from "../../../../../wiki/src/db/entities/article";
import {ApiProperty} from "@nestjs/swagger";

export default class GetArticlesResponseDto {
    // TODO: swagger (ArticleResponse)
    @ApiProperty()
    articles: Article[];
}