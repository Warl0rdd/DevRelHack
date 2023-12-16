import { Injectable } from '@nestjs/common';
import CreateEventDto from '../dto/event.create.dto';
import EventEntity from './db/entities/event';
import SpeakerEntity from './db/entities/speaker';
import TimelineEntity from './db/entities/timeline';

@Injectable()
export class EventsService {
  constructor() {}

  public async createEvent(dto: CreateEventDto) {
    const eventEntity = new EventEntity();
    eventEntity.title = dto.title;

    let timelineEntities: TimelineEntity[] = [];
    let speakerEntities: SpeakerEntity[] = [];
    for (const timeline of dto.timelines) {
      let timelineEntity = new TimelineEntity();
      timelineEntity.start = timeline.start;
      timelineEntity.end = timeline.end;
      let speakerExists = await SpeakerEntity.findOne({
        where: {
          email: timeline.speaker.email,
        },
      });
      if (!speakerExists) {
        speakerExists = new SpeakerEntity();
        speakerExists.email = timeline.speaker.email;
        speakerExists.fullName = timeline.speaker.fullName;
        speakerExists = await speakerExists.save();
      }
      timelineEntity.speaker = speakerExists;

      timelineEntity = await timelineEntity.save();
      timelineEntities.push(timelineEntity);
      if (
        speakerEntities.find((item) => item.email === speakerExists.email) !==
        undefined
      ) {
        speakerEntities.push(speakerExists);
      }
    }

    eventEntity.timelines = timelineEntities;
    eventEntity.speakers = speakerEntities;
    await eventEntity.save();
  }
}
