import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price_snapshot: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Order, (order) => order.orderLines, { onDelete: 'CASCADE', nullable: false, orphanedRowAction: 'soft-delete' })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderLines, { nullable: false, eager: true, orphanedRowAction: 'soft-delete' })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;
}
