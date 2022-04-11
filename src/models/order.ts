import { client } from '../database';

export type Order = {
  id?: number;
  productId: number;
  quantity: number;
  userId: number;
  status: string;
}

export class OrderStore {
  // Show all Orders
  async index():Promise<Order[]> {
    try {
      const conn = await client.connect();
      // @ts-ignore
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch(err) {
      throw new Error(`Could not show all orders. ${err}`);
    }
  }

  // SHOW Order 
  async show(id:string):Promise<Order[]> {
    try {
      const conn = await client.connect();
      // @ts-ignore
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      const order = result.rows;
      return order;
    } catch(err) {
      throw new Error(`Could not show order ${id}. ${err}`);
    }
  } 

  // CREATE Order
  async create(o:Order):Promise<Order> {
    try {
      // @ts-ignore
      const sql = 'INSERT INTO orders (product_id, quantity, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [o.productId, o.quantity, o.userId, o.status]);
      conn.release();
      return result.rows[0];
    } catch(err) {
      throw new Error(`Could not create new order ${err}`)
    }
  }

  // DELETE order
  async delete(id:string):Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch(err) {
      throw new Error(`Could not delete order ${id}. ${err}`);
    }
  }

  // ADD Products to Order
 async addProduct(quantity: number, orderId: string, productId: number):Promise<Order> {
    try {
      //@ts-ignore
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [quantity, orderId, productId]);
      conn.release();        
      return result.rows[0]; 
    } catch(err) {
      throw new Error(`Could not add product ${productId} to ${orderId}`)
    }
  }
}