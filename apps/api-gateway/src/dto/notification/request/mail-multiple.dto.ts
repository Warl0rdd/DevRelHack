import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class MailSingleDto {
    @IsEmail()
    @ApiProperty({ example: '[\'john@mail.com\', \'alex@rabler.ru\']' })
    emails: string[];

    @IsString()
    @ApiProperty({ example: 'Go to work you bastard' })
    subject: string;

    @IsString()
    @ApiProperty({ example: 'some html' })
    body: string;
}