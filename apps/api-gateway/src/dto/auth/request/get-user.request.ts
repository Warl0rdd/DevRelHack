import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class GetUserRequest {
  @ApiProperty()
  @IsEmail()
  email: string;
}
