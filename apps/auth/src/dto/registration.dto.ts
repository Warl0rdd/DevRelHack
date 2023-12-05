import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export default class RegistrationDto {

    @ApiProperty({example: 'john@mail.com'})
    @IsEmail()
    public email: string

    @ApiProperty({example: 'SanyaNagibator2007'})
    @IsString()
    @IsNotEmpty()
    public username: string

    @ApiProperty({example: '123456'})
    @IsString()
    @IsNotEmpty()
    public password: string


}