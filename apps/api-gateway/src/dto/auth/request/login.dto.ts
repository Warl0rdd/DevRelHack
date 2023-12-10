import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class LoginRequestMessageData {
    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    public email: string;
    
    @IsString()
    @ApiProperty({ example: '187348uuhh452' })
    public password: string;
}
