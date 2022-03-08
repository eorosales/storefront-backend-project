import client from '../database';

export type Order = {
  product_id: number;
  quantity: number;
  user_id: number;
  status: boolean;
}

export class OrderStore {
  // TODO: Current Order by User
  // TODO: Completed Orders by User
}