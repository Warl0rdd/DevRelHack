import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import TelegramAccount from './telegram-account.entity';

@Entity('user')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @OneToOne(() => TelegramAccount)
  telegramAccount?: TelegramAccount;
}