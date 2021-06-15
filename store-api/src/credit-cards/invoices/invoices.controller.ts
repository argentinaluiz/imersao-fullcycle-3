import { Controller, Get, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaCreateInvoiceDto } from '../dto/create-invoice.dto';
import { InvoicesService } from '../invoices.service';

@Controller('credit-cards/:creditCard')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('invoices')
  findAll() {
    console.log('findAll');
    return this.invoicesService.findAll();
  }

  @MessagePattern('payments')
  async create(
    @Payload(new ValidationPipe())
    { value: createInvoiceDto }: KafkaCreateInvoiceDto,
  ) {
    console.log(createInvoiceDto);
    return this.invoicesService.create(createInvoiceDto);
  }
}
