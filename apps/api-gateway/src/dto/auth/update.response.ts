import {ApiProperty} from "@nestjs/swagger";
import UserResponse from "./user.response";
import User from '../../../../auth/src/db/entities/user.entity'

export default class UpdateResponse {
    constructor(user: User) {
        this.updatedUser = user
    }

    @ApiProperty({
        type: UserResponse
    })
    public updatedUser: UserResponse
}