import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderLineDto {
  @IsNumber()
  @IsPositive()
  orderId: number;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price_snapshot: number;
}
