export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  price: number;
  created_at: Date;
}

export interface CreditCard {
  number: string;
  name: string;
  expiration_month: number;
  expiration_year: number;
  cvv: string;
}

export enum OrderStatus {
  Approved = "approved",
  Pending = "pending",
}

export interface Order {
  id: string;
  credit_card: Omit<CreditCard, "cvv">;
  items: [{ product: Product; quantity: number; price: number }];
  status: OrderStatus;
}

export interface SecureCreditCard extends Omit<CreditCard, "expiration_month" | "expiration_year" | "cvv">{

}

export interface Invoice {
  id: string;
  amount: number;
  payment_date: string;
  credit_card_id: string;
  credit_card: SecureCreditCard;
  store: string;
  description: string;
  created_at: string;
}
