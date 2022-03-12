import client from '../database';

export type Order = {
  product_id: number;
  quantity: number;
  user_id: number;
  status: boolean;
}

export class OrderStore {
  // TODO: Current Order by User
  async currentOrder(o:Order):Promise<Order> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM orders WHERE product_id = ($1) ';
    const results = await conn.query(sql, [o.user_id]);
    conn.release();
    return results.rows[0];
    
  }
  // TODO: Completed Orders by User
}