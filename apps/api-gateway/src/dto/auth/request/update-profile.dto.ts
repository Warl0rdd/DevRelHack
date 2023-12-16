import {
  IsBase64,
  IsDate,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WorkExperienceDto } from './register.request';

export default class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'John' })
  fullName?: string;

  // YYYY-MM-DD
  @IsDate()
  @IsOptional()
  @ApiProperty({ example: '2000-01-01' })
  birthday?: Date;

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

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ isArray: true })
  tags?: string[];

  @ApiProperty({ type: WorkExperienceDto, isArray: true })
  @Type(() => WorkExperienceDto)
  @ValidateNested({ each: true })
  workExperience?: WorkExperienceDto[];
}
