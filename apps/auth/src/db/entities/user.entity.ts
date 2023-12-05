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
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    length: 100,
    nullable: true,
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
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  // YYYY-MM-DD HH:MM:SS
  @Column({
    type: 'timestamptz',
    nullable: false,
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
  })
  profilePic: string;
}
