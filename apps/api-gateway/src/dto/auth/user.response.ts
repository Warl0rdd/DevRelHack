import { ApiProperty } from '@nestjs/swagger';
import {UserPosition} from "@app/common/enum/user.position.enum";

export default class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  birthday: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  position: UserPosition;

  @ApiProperty()
  profilePic: string;
}
