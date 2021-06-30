import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { CreatePaymentDto } from '../../dto/create-payment.dto';

@Controller()
export class PaymentController {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer,
  ) {}

  @GrpcMethod('PaymentService', 'Payment')
  payment(data: CreatePaymentDto) {
    console.log('receive payment', data);
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
