import {
  IsBase64,
  IsDate,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateProfileDto {
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

  @IsBase64()
  @IsOptional()
  @ApiProperty({ example: 'some base64 profile pic string' })
  profilePic?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  githubLink?: string;
}
