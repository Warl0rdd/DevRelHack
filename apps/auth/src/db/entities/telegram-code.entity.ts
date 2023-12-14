import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('telegram_code')
export default class TelegramCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;
  @Column()
  public email: string;

  @Column()
  public code: string;
}
