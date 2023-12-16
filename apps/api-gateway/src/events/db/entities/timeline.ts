import {BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Speaker from "./speaker";
import Event from "./event";
import {JoinTable} from "typeorm/browser";

@Entity('timelines')
export default class Timeline extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    topic: string;

    @Column("timestamptz")
    start: string;

    @Column("timestamptz")
    end: string;

    @ManyToOne(() => Speaker, (speaker) => speaker.timelines)
    speaker: Speaker;

    @ManyToOne(() => Event, (event) => event.timelines)
    @JoinTable()
    event: Event;
}