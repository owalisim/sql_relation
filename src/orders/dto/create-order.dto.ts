import { IsNumber, IsArray, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderLineItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineItemDto)
  orderLines: OrderLineItemDto[];
}
