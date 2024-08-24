
import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";
@Entity()
export class Users{
    @ObjectIdColumn()
    _id : ObjectId;

    @Column()
    externalId: number;

    @Column()
    city: string;

    @Column()
    country: string;

}