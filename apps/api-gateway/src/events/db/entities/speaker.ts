import {BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Event from "./event";
import {JoinTable} from "typeorm/browser";
import Timeline from "./timeline";

@Entity('speakers')
export default class Speaker extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'full_name'})
    fullName: string;

    @Column()
    email: string;

    @ManyToMany(() => Event, (event) => event.speakers)
    @JoinTable()
    events: Event[];

    @OneToMany(() => Timeline, (timeline) => timeline.speaker)
    timelines: Timeline[]
}