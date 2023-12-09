import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../../db/entities/user.entity';

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
  position: Position;

  @ApiProperty()
  profilePic: string;
}
