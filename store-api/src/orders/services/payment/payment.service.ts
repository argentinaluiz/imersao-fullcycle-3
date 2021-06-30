import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreatePaymentDto } from '../../dto/create-payment.dto';
import { PaymentController } from '../../controllers/payment/payment.controller';
import { Producer } from '@nestjs/microservices/external/kafka.interface';

@Injectable()
export class PaymentService implements OnModuleInit {
  private service: PaymentController;

  constructor(
    @Inject('PAYMENT_PACKAGE') private client: ClientGrpc,
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer,
  ) {}

  async onModuleInit() {
    this.service = this.client.getService<PaymentController>('PaymentService');
  }

  payment(data: CreatePaymentDto): Observable<void> {
    return this.service.payment(data) as any;
  }

  invoice(data: CreatePaymentDto) {
    this.kafkaProducer.send({
      topic: 'payments',
      messages: [
        {
          key: 'payments',
          value: JSON.stringify({
            credit_card_number: data.creditCard.number,
            payment_date: new Date().toISOString(),
            amount: data.amount,
            store: data.store,
            description: data.description,
          }),
        },
      ],
    });
    return;
  }
}
