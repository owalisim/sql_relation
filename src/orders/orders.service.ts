import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderLine } from '../order-lines/entities/order-line.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { UpdateOrderLinesDto } from './dto/update-order-lines.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productsService: ProductsService,
  ) { }

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
    const { userId, orderLines } = updateOrderDto;

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderLines'],
    });
    console.log('Existing order:', order);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (!orderLines || orderLines.length === 0) {
      throw new BadRequestException(
        'Order must contain at least one order line',
      );
    }

    const orderLinesInstances: OrderLine[] = [];

    for (const line of orderLines) {
      const product = await this.productsService.findOne(
        line.productId,
      );

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${line.productId} not found`,
        );
      }

      const orderLine = new OrderLine();

      orderLine.product = product;
      orderLine.quantity = line.quantity;
      orderLine.price_snapshot = Number(product.price);

      orderLinesInstances.push(orderLine);
    }

    order.user = { id: userId } as any;
    order.orderLines = orderLinesInstances;

    await this.orderRepository.save(order);

    return this.findOne(order.id);
  }

  async updateOrderLines(id: number, updateOrderLinesDto: UpdateOrderLinesDto) {
    const { orderLines } = updateOrderLinesDto;

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderLines'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const orderLinesInstances: OrderLine[] = [];

    // for (const line of orderLines) {
    //   // If the line has an ID, try to find the existing order line and update it
    //   if (line.id && line.productId) {
    //     const existingLine = order.orderLines.find(ol => ol.id === line.id);
    //     if (existingLine) {
    //       existingLine.quantity = line.quantity;
    //       existingLine.price_snapshot = Number(existingLine.product.price);
    //       orderLinesInstances.push(existingLine);
    //       continue;
    //     } else if (line.id && !line.productId && !line.quantity) {
    //       // If the line has both an ID and a productId, try to find the existing order line and update it with the new product
    //       const existingLine = order.orderLines.find(ol => ol.id === line.id);
    //       if (existingLine) {
    //         const product = await this.productsService.findOne(line.productId);
    //         if (!product) {
    //           throw new NotFoundException(`Product with ID ${line.productId} not found`);
    //         }
    //         existingLine.product = product;
    //         existingLine.quantity = line.quantity;
    //         existingLine.price_snapshot = Number(product.price);
    //         orderLinesInstances.push(existingLine);
    //         continue;
    //       }
    //     }
    //   }

    //   // If the line doesn't have an ID or the existing line is not found, create a new order line
    //   const product = await this.productsService.findOne(line.productId);
    //   if (!product) {
    //     throw new NotFoundException(`Product with ID ${line.productId} not found`);
    //   }
    //   const orderLine = new OrderLine();
    //   orderLine.product = product;
    //   orderLine.quantity = line.quantity;
    //   orderLine.price_snapshot = Number(product.price);
    //   orderLinesInstances.push(orderLine);
    // }

    for (const line of orderLines) {

      if (line.id && !line.quantity) {
        const existing = order.orderLines.find(ol => ol.id === line.id);

        if (existing) {
          order.orderLines = order.orderLines.filter(ol => ol.id !== line.id);
        }

        continue;
      }

      if (line.id && line.quantity) {
        const existing = order.orderLines.find(ol => ol.id === line.id);

        if (!existing) {
          throw new NotFoundException(`OrderLine ${line.id} not found`);
        }

        const product = await this.productsService.findOne(line.productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${line.productId} not found`);
        }

        existing.quantity = line.quantity;
        existing.product = product;
        existing.price_snapshot = Number(product.price);

        continue;
      }

      if (!line.id && line.productId && line.quantity) {
        const product = await this.productsService.findOne(line.productId);

        const newLine = new OrderLine();
        if (!product) {
          throw new NotFoundException(`Product with ID ${line.productId} not found`);
        }
        newLine.product = product;
        newLine.quantity = line.quantity;
        newLine.price_snapshot = Number(product.price);

        order.orderLines.push(newLine);
      }
    }

    order.orderLines = orderLinesInstances;

    await this.orderRepository.save(order);

    return this.findOne(order.id);
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
