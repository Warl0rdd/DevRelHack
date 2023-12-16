import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UserAddTelegramDto {
  @IsString()
  @ApiProperty({ example: '@JohnMuhomor' })
  telegramName: string;

  @ApiProperty({ example: 'john@mail.com' })
  @IsEmail()
  email: string;
}
