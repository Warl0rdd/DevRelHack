import {IsString} from "class-validator";

export default class GetArticlesByNameRequestDto {
    // TODO: swagger pls
    @IsString()
    name: string;
}