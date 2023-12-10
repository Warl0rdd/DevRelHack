import {ApiProperty} from "@nestjs/swagger";
import User from '../../../../auth/src/db/entities/user.entity'
import {IsNotEmpty, IsNumber} from "class-validator";

export default class UpdateDto {
    @ApiProperty({example: 1})
    @IsNumber()
    public id: number

    @ApiProperty({ type: User })
    @IsNotEmpty()
    public redactedUser: User
}