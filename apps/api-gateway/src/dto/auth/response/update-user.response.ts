import {UserPosition} from "@app/common/enum/user.position.enum";
import {ApiProperty} from "@nestjs/swagger";

export default class UpdateUserResponse {
    @ApiProperty({ example: 'john@mail.com' })
    email: string;

    @ApiProperty({ example: 'John' })
    fullName?: string;

    // YYYY-MM-DD
    @ApiProperty({ example: '2000-01-01' })
    birthday?: string;

    @ApiProperty({ example: '88005553535' })
    phoneNumber?: string;

    @ApiProperty({ example: 'developer/devrel/tester/user (pick one)' })
    position?: UserPosition;

    @ApiProperty({ example: 'some base64 profile pic string' })
    profilePic?: string;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: 'some unix time string' })
    created: Date;

    @ApiProperty({ example: 'some unix time string' })
    updated: Date;
}