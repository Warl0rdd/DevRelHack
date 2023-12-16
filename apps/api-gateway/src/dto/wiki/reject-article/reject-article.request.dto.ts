import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber} from "class-validator";

export default class RejectArticleRequestDto{
    @ApiProperty({ example: 1 })
    @IsNumber()
    id: number;

    // email
    @ApiProperty({ example: 'admin@mail.com' })
    @IsEmail()
    rejected_by: string;
}