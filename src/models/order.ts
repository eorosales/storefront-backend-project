import client from '../database';

export type Order = {
  productId: number;
  quantity: number;
  userId: number;
  status: string;
}

export class OrderStore {
  // Show all orders method
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

  // Show order method
  async show(id:string):Promise<Order> {
    try {
      const conn = await client.connect();
      // @ts-ignore
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      const order = result.rows[0];
      return order;
    } catch(err) {
      throw new Error(`Could not show order ${id}. ${err}`);
    }
  } 

  // Create order method
  async create(o:Order):Promise<Order> {
    try {
      // @ts-ignore
      const sql = 'INSERT INTO orders (product_id, quantity, user_id, status) VALUES ($1, $2, $3, $4) RETURNIG *';
      const conn = await client.connect();
      const result = await conn.query(sql, [o.productId, o.quantity, o.userId, o.status]);
      conn.release();
      return result.rows[0];
    } catch(err) {
      throw new Error(`Could not create new order ${err}`)
    }
  }


  // Current Order by User
  async currentOrder(o:Order):Promise<Order> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM orders WHERE product_id = ($1) ';
    const results = await conn.query(sql, [o.userId]);
    conn.release();
    return results.rows[0];
    
  }
  // Add Products to Order
 async addProduct(quantity: number, orderId: number, productId: number):Promise<Order> {
   try {
    const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
    // @ts-ignore
    const conn = await client.connect();
    const result = await conn.query(sql, [quantity, orderId, productId]);
    
    const order = result.rows[0];

    conn.release();

    return order;
   } catch(err) {
    throw new Error(`Product with ID ${productId} could not be added to order ${orderId}, ${err}`)
   }
 } 
}