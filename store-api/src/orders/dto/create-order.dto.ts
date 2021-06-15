import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { Exists } from 'src/validations/exists.rule';

class OrderItem {
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @Exists(Product)
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  product_id: string;
}

class CreditCard {
  @MaxLength(16)
  @MinLength(16)
  @IsString()
  @IsNotEmpty()
  number: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Min(new Date().getMonth() + 1)
  @IsInt()
  @IsNotEmpty()
  expiration_month: number;

  @Min(new Date().getFullYear())
  @IsInt()
  @IsNotEmpty()
  expiration_year: number;

  @MaxLength(4)
  @IsString()
  @IsNotEmpty()
  cvv: string;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CreditCard)
  @IsObject()
  @IsNotEmpty()
  credit_card: CreditCard;

  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  items: OrderItem[];
}
