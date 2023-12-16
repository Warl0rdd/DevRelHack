import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ enum: UserPosition })
  @IsEnum(UserPosition)
  position: UserPosition;

  @ApiProperty()
  @IsString()
  profilePic?: string;

  @ApiProperty()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ type: WorkExperienceDto, isArray: true })
  @Type(() => WorkExperienceDto)
  @ValidateNested({ each: true })
  workExperience?: WorkExperienceDto[];
}
