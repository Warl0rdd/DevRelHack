import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class SendTelegramCodeRequest {
  @IsString()
  @ApiProperty()
  telegramName: string;
}
