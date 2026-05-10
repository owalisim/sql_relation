import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { OrderLinesModule } from './order-lines/order-lines.module';
import { ProductsModule } from './products/products.module';
import { User } from './users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Or } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { OrderLine } from './order-lines/entities/order-line.entity';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'myapp',
      entities: [User, Product,Order, OrderLine],
      synchronize: true,
    }),
    UsersModule, OrdersModule, OrderLinesModule, ProductsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
   constructor(private dataSource: DataSource) {}
}
