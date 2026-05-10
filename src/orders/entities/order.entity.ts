import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, JoinColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderLine } from '../../order-lines/entities/order-line.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => User, (user) => user.orders, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order, { cascade: true })
  orderLines: OrderLine[];

   @CreateDateColumn()
  createdAt: Date;
}
