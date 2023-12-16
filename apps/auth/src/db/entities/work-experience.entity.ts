import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserPosition } from '../../../../../libs/common/src/enum/user.position.enum';
import UserEntity from './user.entity';

@Entity('work_experience')
export default class WorkExperienceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column()
  public company: string;

  @Column({ type: 'timestamptz', nullable: false })
  public startDate: Date;

  @Column({ type: String })
  public position: UserPosition;

  @Column({ type: 'timestamptz', nullable: true })
  public endDate?: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;
}
