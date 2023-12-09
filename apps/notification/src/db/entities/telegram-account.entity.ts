import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TelegramAccountStatusEnum } from '../../telegram/telegram.account-status.enum';
import User from './user.entity';

@Entity('telegram_account')
export default class TelegramAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'telegram_name' })
  telegramName: string;

  @Column({ type: String, name: 'telegram_status' })
  telegramStatus: TelegramAccountStatusEnum;

  @Column({ type: String, name: 'telegram_confirm_code' })
  telegramConfirmCode: string;

  @Column({ type: String, nullable: true, name: 'telegram_chat_id' })
  telegramChatId?: string;

  @OneToOne(() => User, (user) => user.telegramAccount)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
