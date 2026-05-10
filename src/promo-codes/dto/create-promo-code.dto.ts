import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, ArrayUnique, Min } from "class-validator";

export class CreatePromoCodeDto {
    @IsString()
    @IsNotEmpty()
    code: string;

    @Min(1)
    discount: number;

    @IsDateString()
    expirationDate: Date;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    userIds?: number[];
}
