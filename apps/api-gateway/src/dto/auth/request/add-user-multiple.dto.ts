import {IsEmail} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class AddUserMultipleDto {
    @IsEmail({}, {each: true})
    @ApiProperty()
    public emails: string[];
}