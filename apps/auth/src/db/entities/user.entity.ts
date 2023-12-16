import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPosition } from '../../../../../libs/common/src/enum/user.position.enum';
import TagEntity from './tags.entity';
import WorkExperienceEntity from './work-experience.entity';

@Entity('auth_users')
export default class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    length: 100,
    nullable: true,
    name: 'full_name',
  })
  fullName: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  birthday: Date;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @Column({
    nullable: true,
    name: 'phone_number',
  })
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: UserPosition,
  })
  position: UserPosition;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'profile_pic',
  })
  profilePic: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'github_link',
  })
  public githubLink?: string;

  @ManyToMany(() => TagEntity, {})
  @JoinTable({ name: 'tag_user' })
  public tags: TagEntity[];

  @OneToMany(() => WorkExperienceEntity, (work) => work.user, {
    cascade: true,
  })
  public workExperience: WorkExperienceEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  public created;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updated;
}
