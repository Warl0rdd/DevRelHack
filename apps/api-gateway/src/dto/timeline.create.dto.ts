import { ApiProperty } from '@nestjs/swagger';
import SpeakerCreateDto from './speaker.create.dto';

export default class TimelineCreateDto {
  @ApiProperty()
  topic: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty({ type: SpeakerCreateDto })
  speaker: SpeakerCreateDto;
}
