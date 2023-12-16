import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsEmail, IsNotEmpty, IsString} from "class-validator";

export default class AddArticleRequestDto {
    @ApiProperty({ example: 'Docs for this shit' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'some mardown\ntext' })
    @IsString()
    body: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ example: '[\'python\', \'git\']' })
    tags: string[];

    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    author_email: string;
}