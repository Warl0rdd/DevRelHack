import { ApiProperty } from '@nestjs/swagger';

export default class SpeakerCreateDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;
}
