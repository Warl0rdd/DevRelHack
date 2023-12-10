import {ApiProperty} from "@nestjs/swagger";

export default class AddUserResponseDto {
    @ApiProperty({
        example: 'john@mail.com'
    })
    public email: string;

    @ApiProperty({
        example: '17182hfhsadf28'
    })
    public password: string;
}