import {ApiProperty} from "@nestjs/swagger";
import {IsEmail} from "class-validator";

export default class AddUserDto {
    @ApiProperty({example: 'john@mail.com'})
    @IsEmail()
    public email: string;
}
