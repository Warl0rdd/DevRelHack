import { ApiProperty } from '@nestjs/swagger';
import UserResponse from './user.response';

export default class RegistrationResponse {
  @ApiProperty({
    type: UserResponse,
  })
  public user: UserResponse;
}
