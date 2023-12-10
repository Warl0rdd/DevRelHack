import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export default class RefreshTokenDto {
    @IsString()
    @ApiProperty({ example: 'someheaders.somepayload.somesignature' })
    accessToken: string;

    @IsString()
    @ApiProperty({ example: 'someheaders.somepayload.somesignature' })
    refreshToken: string;
}
