import {IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class ApproveArticleResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'djksfjksjfd' })
    title: string;

    @ApiProperty({ example: 'markdown' })
    body: string;

    @ApiProperty({ example: '[sometagsarray]' })
    tags: string[];

    @ApiProperty({ example: 'john@mail.com' })
    author_email: string;

    @ApiProperty({ example: 'admin@mail.com' })
    approved_by: string;

    @ApiProperty({ example: 'sometimestamp' })
    created: string;

    @ApiProperty({ example: 'sometimestamp' })
    published: string;
}