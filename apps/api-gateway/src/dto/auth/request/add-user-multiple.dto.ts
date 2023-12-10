import {IsEmail} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class AddUserMultipleDto {
    @IsEmail({}, {each: true})
    @ApiProperty({ example: '[\'john@mail.com\', \'alex@mail.ru\', \'kate@rambler.ru\']' })
    public emails: string[];
}