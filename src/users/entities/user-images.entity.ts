import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserImages {
    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  avatarUrl: string;

    @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, user => user.images, {orphanedRowAction: 'delete' })
  @JoinColumn({name: 'user_id'})
  user: User;
}