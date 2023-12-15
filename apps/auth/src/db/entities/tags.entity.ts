import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('tag')
export default class TagEntity extends BaseEntity {
  @PrimaryColumn()
  public name: string;
}
