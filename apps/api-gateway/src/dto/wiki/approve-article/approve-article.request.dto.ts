import {IsEmail, IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class ApproveArticleRequestDto {
    @IsNumber()
    @ApiProperty({ example: 1 })
    id: number;

    // email
    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    approved_by: string;
}