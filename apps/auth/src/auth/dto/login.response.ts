import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import UserResponse from './user.response';

export default class LoginResponse {
    @ApiProperty({
        type: UserResponse,
    })
    public user: UserResponse;

    @ApiProperty({ example: 'someheaders.somepayload.somesign' })
    @IsString()
    public token: string;
}
