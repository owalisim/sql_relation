
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { PromoCode } from 'src/promo-codes/entities/promo-code.entity';
import { UserProfile } from './user-profile.entity';
import { UserImages } from './user-images.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => PromoCode, (promoCode) => promoCode.users, { onDelete: 'CASCADE' })
  promoCodes: PromoCode[];

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true, nullable: true })
  //  @JoinColumn()
  profile: UserProfile;

  @OneToMany(() => UserImages, (images) => images.user, { cascade: true })
  //  @JoinColumn()
  images: UserImages[];
}
