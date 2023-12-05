import {ApiProperty} from "@nestjs/swagger";
import User from "../entity/user.entity";
import {IsString} from "class-validator";

export default class RegistrationResponse {
    constructor(user: User, token: string) {
        this.user = user
        this.token = token
    }

    @ApiProperty({example: {
            email: 'some email',
            password: 'some pass',
            registrationTimestamp: '2023-12-05 22:06:15'
        }})
    public user: User

    @ApiProperty({example: "someheaders.somepayload.somesign"})
    @IsString()
    public token: string
}