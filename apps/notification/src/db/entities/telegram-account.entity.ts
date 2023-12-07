import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TelegramAccountStatusEnum } from '../../telegram/telegram.account-status.enum';

@Entity('telegram-account')
export default class TelegramAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'telegram_name' })
  telegramName?: string;

  @Column({ type: String, nullable: true, name: 'telegram_status' })
  telegramStatus?: TelegramAccountStatusEnum;

  @Column({ type: String, nullable: true, name: 'telegram_confirm_code' })
  telegramConfirmCode?: string;

  @Column({ type: String, nullable: true, name: 'telegram_chat_id' })
  telegramChatId?: string;
}
