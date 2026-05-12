import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
    @JoinTable({
        name: 'user_promo_codes',
        joinColumn: {
            name: "promo_code_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })
    users: User[];
}
