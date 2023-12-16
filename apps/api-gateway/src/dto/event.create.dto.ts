import { ApiProperty } from '@nestjs/swagger';
import TimelineCreateDto from './timeline.create.dto';

export default class CreateEventDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ type: TimelineCreateDto, isArray: true })
  timelines: TimelineCreateDto[];
}
