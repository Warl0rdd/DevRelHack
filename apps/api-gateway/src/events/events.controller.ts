import { Controller, Get, Post } from '@nestjs/common';
import CreateEventDto from '../dto/event.create.dto';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventService: EventsService) {}
  @Post()
  public async creatEvent(dto: CreateEventDto) {
    return this.eventService.createEvent(dto);
  }
}
