import { Module } from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from './entities/credit-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, CreditCard])],
  controllers: [CreditCardsController, InvoicesController],
  providers: [CreditCardsService, InvoicesService],
})
export class CreditCardsModule {}
