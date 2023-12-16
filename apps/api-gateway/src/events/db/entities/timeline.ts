import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import SpeakerEntity from './speaker';
import EventEntity from './event';
import { JoinTable } from 'typeorm/browser';

@Entity('timelines')
export default class TimelineEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column('timestamptz')
  start: Date;

  @Column('timestamptz')
  end: Date;

  @ManyToOne(() => SpeakerEntity, (speaker) => speaker.timelines)
  speaker: SpeakerEntity;

  @ManyToOne(() => EventEntity, (event) => event.timelines)
  @JoinTable()
  event: EventEntity;
}
