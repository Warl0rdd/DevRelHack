import {ApiProperty} from "@nestjs/swagger";

export default class LoginResponseDto {
    @ApiProperty({ example: 'someheaders.somepayload.somesignature' })
    public accessToken: string;

    @ApiProperty({ example: 'someheaders.somepayload.somesignature' })
    public refreshToken: string;
}
