import {IsEmail} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class BlockUserDto {
    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    public email: string;
}
