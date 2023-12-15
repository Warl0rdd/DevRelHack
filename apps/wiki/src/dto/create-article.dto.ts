import {IsArray, IsString} from "class-validator";

export default class CreateArticleDto {
    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsArray()
    tags: string[];
}