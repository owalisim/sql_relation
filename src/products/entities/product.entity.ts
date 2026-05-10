import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderLine } from '../../order-lines/entities/order-line.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  description: string;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.product)
  orderLines: OrderLine[];
}
