import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('articles')
export default class Article extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 200,
        unique: true
    })
    title: string;

    @Column({
        unique: true
    })
    body: string;

    @Column()
    tags: string[];

    @CreateDateColumn({ type: 'timestamptz' })
    public created;
}