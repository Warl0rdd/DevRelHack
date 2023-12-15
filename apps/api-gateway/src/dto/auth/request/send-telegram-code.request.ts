import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class SendTelegramCodeRequest {
  @IsEmail()
  @ApiProperty()
  telegramName: string;
}
