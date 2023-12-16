import { ApiProperty } from '@nestjs/swagger';
import UserEntity from '../../db/entities/user.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class UpdateDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  public id: number;

  @ApiProperty({ type: UserEntity })
  @IsNotEmpty()
  public redactedUser: UserEntity;
}
