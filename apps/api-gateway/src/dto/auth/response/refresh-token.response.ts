import {ApiProperty} from "@nestjs/swagger";

export default class RefreshTokenResponse {
    @ApiProperty({ example: 'someheaders.somepayload.somesignature' })
    accessToken: string;

    @ApiProperty({ example: 'someheaders.somepayload.somesignature' })
    refreshToken: string;
}
