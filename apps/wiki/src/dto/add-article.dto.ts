import {IsArray, IsString} from "class-validator";

export default class AddArticleDto {
    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsArray()
    tags: string[];
}