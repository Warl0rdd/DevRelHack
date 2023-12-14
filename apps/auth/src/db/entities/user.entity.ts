import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPosition } from '../../../../../libs/common/src/enum/user.position.enum';

@Entity('db_users')
export default class User extends BaseEntity {
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

  // YYYY-MM-DD
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  birthday: string;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @Column({
    nullable: true,
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserPosition,
    default: UserPosition.FE_DEVELOPER,
  })
  position: UserPosition;

  // Path to pfp
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'profile_pic',
  })
  profilePic: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public created;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updated;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'github_link',
  })
  public githubLink: string;
}
