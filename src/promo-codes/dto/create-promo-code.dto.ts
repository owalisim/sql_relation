import { IsDate, IsDateString, IsNegative, IsNotEmpty, IsString, Min } from "class-validator";

export class CreatePromoCodeDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @Min(1)
    discount: number;

    @IsDateString()
    expirationDate: Date;
}
