import { Type } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Exists } from 'src/validations/exists.rule';
import { CreditCard } from '../entities/credit-card.entity';

export class CreateInvoiceDto {
  @Exists(CreditCard, 'number')
  @IsString()
  @IsNotEmpty()
  credit_card_number: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsISO8601()
  @IsNotEmpty()
  payment_date: Date;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  store: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class KafkaCreateInvoiceDto {
  @Type(() => CreateInvoiceDto)
  @ValidateNested()
  value: CreateInvoiceDto;
}
