import {ApiProperty} from "@nestjs/swagger";
import ArticleOnModeration from "../../../../../wiki/src/db/entities/article.on-moderation";

export default class GetArticlesOnModerationResponseDto {
    // TODO: swagger (ArticleOnModerationResponse)
    @ApiProperty()
    articles: ArticleOnModeration[];
}