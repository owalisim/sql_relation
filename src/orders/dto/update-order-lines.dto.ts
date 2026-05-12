export class UpdateOrderLinesDto {
  orderLines: {
    id?: number;
    productId: number;
    quantity: number;
  }[];
}