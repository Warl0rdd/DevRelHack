import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Position {
  DEVELOPER = 'developer',
  TESTER = 'tester',
  DEVREL = 'devrel',
  USER = 'user',
}

@Entity('user')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    unique: true
  })
  email: string;

  @Column({
    length: 255
  })
  password: string;

  @Column({
    length: 100,
    nullable: true,
    name: 'full_name'
  })
  fullName: string;

  // YYYY-MM-DD
  @Column({
    type: 'timestamptz',
    nullable: true
  })
  birthday: string;

  @Column({
    default: true,
    name: 'is_active'
  })
  isActive: boolean;

  @Column({
    nullable: true,
    name: 'phone_number'
  })
  phoneNumber: string;

  // YYYY-MM-DD HH:MM:SS
  @Column({
    type: 'timestamptz',
    nullable: false,
    name: 'registration_timestamp'
  })
  registrationTimestamp: string;

  @Column({
    type: 'enum',
    enum: Position,
    default: Position.USER,
  })
  position: Position;

  // Path to pfp
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'profile_pic'
  })
  profilePic: string;
}
