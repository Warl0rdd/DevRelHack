import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import EventEntity from './event';
import { JoinTable } from 'typeorm/browser';
import TimelineEntity from './timeline';

@Entity('speakers')
export default class SpeakerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  email: string;

  @ManyToMany(() => EventEntity, (event) => event.speakers)
  @JoinTable()
  events: EventEntity[];

  @OneToMany(() => TimelineEntity, (timeline) => timeline.speaker)
  timelines: TimelineEntity[];
}
