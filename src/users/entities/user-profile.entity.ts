import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @Column()
  avatarUrl: string;

  @OneToOne(() => User, user => user.profile, {orphanedRowAction: 'soft-delete' })
  @JoinColumn({name: 'user_id'})
  user: User;
}