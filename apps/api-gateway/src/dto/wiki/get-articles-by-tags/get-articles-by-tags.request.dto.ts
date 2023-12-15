import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty} from "class-validator";

export default class GetArticlesByTagsRequestDto {
    @ApiProperty({ example: '[\'python\']' })
    @IsArray()
    @IsNotEmpty()
    tags: string[];
}