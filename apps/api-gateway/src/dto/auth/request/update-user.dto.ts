import {UserPosition} from "@app/common/enum/user.position.enum";
import {IsBase64, IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class UpdateUserDto {
    @IsEmail()
    @ApiProperty({ example: 'john@mail.com' })
    email: string;

    @IsString()
    @ApiProperty({ example: 'John' })
    fullName?: string;

    // YYYY-MM-DD
    @IsDate()
    @ApiProperty({ example: '2000-01-01' })
    birthday?: string;

    @IsPhoneNumber()
    @ApiProperty({ example: '88005553535' })
    phoneNumber?: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'developer/devrel/tester/user (pick one)' })
    position?: UserPosition;

    @IsBase64()
    @ApiProperty({ example: 'some base64 profile pic string' })
    profilePic?: string;
}