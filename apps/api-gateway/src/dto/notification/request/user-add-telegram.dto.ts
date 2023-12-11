import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class UserAddTelegramDto {
    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    email: string;

    @IsString()
    @ApiProperty({ example: '@JohnMuhomor' })
    telegramName: string;
}