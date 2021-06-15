import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Connection, In, Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order, OrderStatus } from '../entities/order.entity';
import { PaymentService } from './payment/payment.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private paymentClient: PaymentService,
    private connection: Connection,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const order = queryRunner.manager.create<Order>(Order, createOrderDto);

    const products = await this.productRepo.find({
      where: {
        id: In(order.items.map((i) => i.product_id)),
      },
    });

    order.items.forEach((i) => {
      const product = products.find((p) => p.id === i.product_id);
      i.price = product.price;
    });
    let newOrder: Order;
    try {
      newOrder = await queryRunner.manager.save(order);

      await this.paymentClient
        .payment({
          creditCard: newOrder.credit_card,
          amount: newOrder.total,
        })
        .toPromise();
      await queryRunner.manager.update(
        Order,
        { id: newOrder.id },
        { status: OrderStatus.Approved },
      );
      await queryRunner.commitTransaction();
      newOrder = await this.orderRepo.findOneOrFail(newOrder.id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
    return newOrder;

    // const order = this.orderRepo.create(createOrderDto);
    // const products = await this.productRepo.find({
    //   where: {
    //     id: In(order.items.map((i) => i.product_id)),
    //   },
    // });
    // order.items.forEach((i) => {
    //   const product = products.find((p) => p.id === i.product_id);
    //   i.price = product.price;
    // });
    // const newOrder = await this.orderRepo.save(order);
    // await this.paymentClient
    //   .payment({
    //     creditCard: newOrder.credit_card,
    //     amount: newOrder.total,
    //   })
    //   .toPromise();
    // return newOrder;
  }

  async findOne(id: string) {
    console.log(
      await this.orderRepo.findOneOrFail(id, {
        relations: ['items', 'items.product'],
      }),
    );
    return this.orderRepo.findOneOrFail(id, {
      relations: ['items', 'items.product'],
    });
  }
}
