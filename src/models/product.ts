import client from '../database';

export type Product = {
  id: number,
  name: string,
  price: number,
  category: string
}

export class ProductStore {
  // TODO: Index Method
  async index():Promise<Product[]> {  
    const conn = await client.connect();
    const sql = 'SELECT * FROM books';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }
  // TODO: Show Method
  // TODO: Create Method 
}