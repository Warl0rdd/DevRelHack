import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class TelegramLoginRequest {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  telegramName: string;
}
