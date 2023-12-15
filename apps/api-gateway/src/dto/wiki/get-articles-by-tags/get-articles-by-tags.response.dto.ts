import Article from "../../../../../../apps/wiki/src/db/entities/article";
import {ApiProperty} from "@nestjs/swagger";

export default class GetArticlesByTagsResponseDto {
    @ApiProperty({ example: 'in json it is sth like {\"python\": {...articles}, \"git\": {...articles}} etc'})
    articles: Map<string, Article[]>;
}