import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class TelegramSingleDto {
    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    email: string;

    @IsString()
    @ApiProperty({ example: 'Go to work you fucking bastard' })
    message: string;
}
