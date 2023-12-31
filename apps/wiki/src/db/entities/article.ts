import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('articles')
export default class Article extends BaseEntity {
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

  @Column('varchar', { array: true })
  tags: string[];

  @Column()
  author_email: string;

  @Column()
  approved_by: string;

  @Column({
    type: 'timestamptz',
  })
  public created;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  public published;
}
