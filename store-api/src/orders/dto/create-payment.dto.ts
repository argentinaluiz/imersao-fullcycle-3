export class CreatePaymentDto {
  creditCard: {
    name: string;
    number: string;
    expiration_month: number;
    expiration_year: number;
    cvv: string;
  };
  amount: number;
  store: string;
  description: string;
}
