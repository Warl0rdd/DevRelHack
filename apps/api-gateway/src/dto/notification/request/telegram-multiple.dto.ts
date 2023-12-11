import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class TelegramMultipleDto {
    @IsEmail()
    @ApiProperty({ example: '[\'john@mail.com\', \'alex@rabler.ru\']' })
    emails: string[];

    @IsString()
    @ApiProperty({ example: 'Go to work you fucking bastard' })
    message: string;
}