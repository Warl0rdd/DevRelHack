import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserPosition } from '../../../../../../libs/common/src/enum/user.position.enum';

export class WorkExperienceDto {
  @ApiProperty()
  public company: string;

  @ApiProperty()
  @IsDateString()
  public startDate: Date;

  @ApiProperty()
  @IsEnum(UserPosition)
  public position: UserPosition;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  public endDate?: Date;
}

export default class RegisterRequest {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsDateString()
  birthday: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ enum: UserPosition })
  @IsEnum(UserPosition)
  position: UserPosition;

  @ApiPropertyOptional()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ type: WorkExperienceDto, isArray: true })
  @Type(() => WorkExperienceDto)
  @ValidateNested({ each: true })
  @IsOptional()
  workExperience?: WorkExperienceDto[];

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: true })
  file?: Express.Multer.File;
}
