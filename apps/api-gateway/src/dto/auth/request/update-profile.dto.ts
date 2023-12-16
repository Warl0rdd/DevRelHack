import {
  IsBase64,
  IsDate,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WorkExperienceDto } from './register.request';
import { UserPosition } from '../../../../../../libs/common/src/enum/user.position.enum';

export default class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'John' })
  fullName?: string;

  // YYYY-MM-DD
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ example: '2000-01-01' })
  birthday?: Date;

  @IsPhoneNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: '88005553535' })
  phoneNumber?: string;

  @IsBase64()
  @IsOptional()
  @ApiPropertyOptional({ example: 'some base64 profile pic string' })
  profilePic?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  githubLink?: string;

  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ isArray: true })
  tags?: string[];

  @ApiPropertyOptional({ type: WorkExperienceDto, isArray: true })
  @Type(() => WorkExperienceDto)
  @ValidateNested({ each: true })
  workExperience?: WorkExperienceDto[];

  @ApiPropertyOptional({
    enum: UserPosition,
  })
  @IsEnum(UserPosition)
  @IsOptional()
  position?: UserPosition;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: true })
  file?: Express.Multer.File;
}
