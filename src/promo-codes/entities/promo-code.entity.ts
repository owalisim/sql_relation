import { User } from "src/users/entities/user.entity";
import { Column, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

export class PromoCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    discount: number;

    @Column()
    expirationDate: Date;

    @ManyToMany(() => User, user => user.promoCodes)
    users: User[];
}
