import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import SpeakerEntity from './speaker';
import TimelineEntity from './timeline';
import { JoinTable } from 'typeorm/browser';

@Entity('events')
export default class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => TimelineEntity, (timeline) => timeline.event)
  timelines: TimelineEntity[];

  @ManyToMany(() => SpeakerEntity, (speaker) => speaker.events)
  @JoinTable()
  speakers: SpeakerEntity[];
}
