import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderLine } from './entities/order-line.entity';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';

@Injectable()
export class OrderLinesService {
  constructor(
    @InjectRepository(OrderLine)
    private readonly orderLineRepository: Repository<OrderLine>,
  ) {}

  async create(createOrderLineDto: CreateOrderLineDto) {
    const { orderId, productId, quantity, price_snapshot } = createOrderLineDto;
    const orderLine = this.orderLineRepository.create({
      quantity: quantity,
      price_snapshot: price_snapshot,
      order: { id: orderId },
      product: { id: productId },
    });
    return await this.orderLineRepository.save(orderLine);
  }

  async findAll() {
    return await this.orderLineRepository.find({
      relations: ['order', 'product'],
    });
  }

  async findOne(id: number) {
    const orderLine = await this.orderLineRepository.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!orderLine) {
      throw new NotFoundException(`OrderLine with ID ${id} not found`);
    }
    return orderLine;
  }

  async update(id: number, updateOrderLineDto: UpdateOrderLineDto) {
    await this.findOne(id);
    await this.orderLineRepository.update(id, updateOrderLineDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const orderLine = await this.findOne(id);
    await this.orderLineRepository.remove(orderLine);
    return orderLine;
  }

  async findByOrderId(orderId: number) {
    return await this.orderLineRepository.find({
      where: { order: { id: orderId } },
      relations: ['product'],
    });
  }
}
