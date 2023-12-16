import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleStatus } from '@app/common/enum/wiki-service.article-status.enum';

@Entity('on_moderation')
export default class ArticleOnModeration extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200,
    unique: true,
  })
  title: string;

  @Column({
    unique: true,
  })
  body: string;

  @Column({ type: String, array: true })
  tags: string[];

  @Column()
  author_email: string;

  @Column({
    nullable: true,
  })
  moderated_by: string;

  @Column({
    default: ArticleStatus.onModeration,
  })
  status: ArticleStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  public created;

  @Column()
  public moderated_at;
}
