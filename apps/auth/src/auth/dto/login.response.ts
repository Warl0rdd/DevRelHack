import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class LoginResponse {
  @ApiProperty()
  @IsString()
  public tokens: string;
}
