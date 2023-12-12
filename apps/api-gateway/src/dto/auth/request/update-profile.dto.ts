import { IsBase64, IsDate, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateProfileDto {
  @IsString()
  @ApiProperty({ example: 'John' })
  fullName?: string;

  // YYYY-MM-DD
  @IsDate()
  @ApiProperty({ example: '2000-01-01' })
  birthday?: string;

  @IsPhoneNumber()
  @ApiProperty({ example: '88005553535' })
  phoneNumber?: string;

  @IsBase64()
  @ApiProperty({ example: 'some base64 profile pic string' })
  profilePic?: string;
}
