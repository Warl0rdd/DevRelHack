import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class HelloDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  public hello: string;
}
