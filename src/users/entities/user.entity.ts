
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { PromoCode } from 'src/promo-codes/entities/promo-code.entity';

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

  @ManyToMany(() => PromoCode, (promoCode) => promoCode.users)
  promoCodes: PromoCode[];
}
