import {IsEmail} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class UserRegisteredDto {
    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    email: string;
}
