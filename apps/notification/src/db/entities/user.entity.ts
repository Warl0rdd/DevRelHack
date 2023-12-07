import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TelegramAccountStatusEnum } from '../../telegram/telegram.account-status.enum';

@Entity('user')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Column({ nullable: true, name: 'telegram_name' })
  telegramName?: string;

  @Column({ type: String, nullable: true, name: 'telegram_status' })
  telegramStatus?: TelegramAccountStatusEnum;

  @Column({ type: String, nullable: true, name: 'telegram_confirm_code' })
  telegramConfirmCode?: string;
}
