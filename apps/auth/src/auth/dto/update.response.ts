import { ApiProperty } from '@nestjs/swagger';
import UserResponse from './user.response';

export default class UpdateResponse {
  @ApiProperty({
    type: UserResponse,
  })
  public updatedUser: UserResponse;
}
