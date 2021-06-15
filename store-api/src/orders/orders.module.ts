import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PaymentService } from './services/payment/payment.service';
import { PaymentController } from './controllers/payment/payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: process.env.KAFKA_CLIENT_ID,
              brokers: [process.env.KAFKA_BROKER],
            },
            consumer: {
              groupId:
                !process.env.KAFKA_CONSUMER_GROUP_ID ||
                process.env.KAFKA_CONSUMER_GROUP_ID === ''
                  ? 'my-consumer-' + Math.random()
                  : process.env.KAFKA_CONSUMER_GROUP_ID,
            },
          },
        }),
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'PAYMENT_PACKAGE',
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            url: process.env.GRPC_URL,
            package: 'payment',
            protoPath: join(__dirname, 'proto/payment.proto'),
          },
        }),
      },
    ]),
  ],
  controllers: [OrdersController, PaymentController],
  providers: [
    OrdersService,
    PaymentService,
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (kafkaClient: ClientKafka) => {
        return kafkaClient.connect();
      },
      inject: ['KAFKA_SERVICE'],
    },
  ],
})
export class OrdersModule {}
