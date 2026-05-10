import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderLinesService } from './order-lines.service';
import { OrderLine } from './entities/order-line.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderLine])],
  providers: [OrderLinesService],
  exports: [OrderLinesService],
})
export class OrderLinesModule {}
