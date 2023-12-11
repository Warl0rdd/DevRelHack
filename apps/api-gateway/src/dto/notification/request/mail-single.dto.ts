import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class MailMultipleDto {
    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    email: string;

    @IsString()
    @ApiProperty({ example: 'Go to work you bastard' })
    subject: string;

    @IsString()
    @ApiProperty({ example: 'some html' })
    body: string;
}
