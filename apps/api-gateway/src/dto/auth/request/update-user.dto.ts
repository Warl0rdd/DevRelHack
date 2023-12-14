import { UserPosition } from '@app/common/enum/user.position.enum';
import {
  IsBase64,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'John' })
  fullName?: string;

  // YYYY-MM-DD
  @IsDate()
  @IsOptional()
  @ApiProperty({ example: '2000-01-01' })
  birthday?: string;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({ example: '88005553535' })
  phoneNumber?: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'developer/devrel/tester/user (pick one)' })
  position?: UserPosition;

  @IsBase64()
  @IsOptional()
  @ApiProperty({ example: 'some base64 profile pic string' })
  profilePic?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  githubLink?: string;
}
