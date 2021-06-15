import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from '../credit-cards/dto/create-invoice.dto';
import { CreditCard } from './entities/credit-card.entity';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(CreditCard)
    private creditCardRepo: Repository<CreditCard>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const creditCard = await this.creditCardRepo.findOne({
      where: { number: createInvoiceDto.credit_card_number },
    });
    const { credit_card_number, ...data } = createInvoiceDto;
    const invoice = this.invoiceRepo.create({
      ...createInvoiceDto,
      credit_card_id: creditCard.id,
    });
    this.invoiceRepo.save(invoice);
  }

  findAll() {
    return this.invoiceRepo.find();
  }
}
