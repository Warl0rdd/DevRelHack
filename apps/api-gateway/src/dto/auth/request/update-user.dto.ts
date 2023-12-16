import { UserPosition } from '@app/common/enum/user.position.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import UpdateProfileDto from './update-profile.dto';

export default class UpdateUserDto extends UpdateProfileDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'developer/devrel/tester/user (pick one)',
    enum: UserPosition,
  })
  @IsEnum(UserPosition)
  position?: UserPosition;
}
