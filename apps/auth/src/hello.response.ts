import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class HelloResponse {
  @ApiProperty({ example: 'string' })
  @IsString()
  public helloAnother: string;
}
