import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderLine } from '../order-lines/entities/order-line.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, orderLines } = createOrderDto;

    if (!orderLines || orderLines.length === 0) {
      throw new BadRequestException('Order must contain at least one order line');
    }

    const orderLinesInstances: OrderLine[] = [];
    for (const line of orderLines) {
      const product = await this.productsService.findOne(line.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${line.productId} not found`);
      }

      const orderLine = new OrderLine();
      orderLine.product = product;
      orderLine.quantity = line.quantity;
      orderLine.price_snapshot = Number(product.price);
      orderLinesInstances.push(orderLine);
    }

    const order = this.orderRepository.create({
      user: { id: userId },
      orderLines: orderLinesInstances,
    });

    const savedOrder = await this.orderRepository.save(order);

    return this.findOne(savedOrder.id);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['user', 'orderLines', 'orderLines.product'],
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderLines', 'orderLines.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);
    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return order;
  }

  // async findByUserId(userId: number) {
  //   return await this.orderRepository.find({
  //     where: { user: { id: userId } },
  //     relations: ['orderLines', 'orderLines.product'],
  //   });
  // }
}
