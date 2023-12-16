import {ApiProperty, ApiTags} from "@nestjs/swagger";

export default class RejectArticleResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'some article about some shit' })
    title: string;

    @ApiProperty({ example: 'some md' })
    body: string;

    @ApiProperty({ example: '[sometags]' })
    tags: string[];

    @ApiProperty({ example: 'john@mail.com' })
    author_email: string;

    @ApiProperty({ example: 'admin@mail.com' })
    rejected_by: string;

    @ApiProperty({ example: 'timestampz' })
    created: string;

    @ApiProperty({ example: 'timestampz' })
    rejected_at: string;
}