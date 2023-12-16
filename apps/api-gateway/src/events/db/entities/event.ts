import {BaseEntity, Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Speaker from "./speaker";
import Timeline from "./timeline";
import {JoinTable} from "typeorm/browser";

@Entity('events')
export default class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(() => Timeline, (timeline) => timeline.event)
    timelines: Timeline[];

    @ManyToMany(() => Speaker, (speaker) => speaker.events)
    @JoinTable()
    speakers: Speaker[];

}