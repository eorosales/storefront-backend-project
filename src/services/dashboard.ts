// A service file is a place to write extra business logic that does not belong in a handler or a model or orchestrates changes with multiple models.

import client from '../database'

export class DashboardQueries {
  async productsInOrder():Promise<{ name: string, price: number, order_id: string }[]>  {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.id';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch(err) {
      throw new Error(`${err}`);
    }
  }
}