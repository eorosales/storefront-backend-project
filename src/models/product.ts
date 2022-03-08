import client from '../database';

export type Product = {
  id: number,
  name: string,
  price: number,
  category: string
}

export class ProductStore {
  
  async index():Promise<Product[]> {  
    const conn = await client.connect();
    const sql = 'SELECT * FROM products';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }
  
  async show(id:string):Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch(err) {
      throw new Error(`Could not find product with id of ${id}. Error: ${err}`);
    }
  }
  
  async create(p:Product):Promise<Product> {
    const conn = await client.connect();
    const sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3)';
    const result = await conn.query(sql, [p.name, p.price, p. category]);
    conn.release();
    const product = result.rows[0];
    return product;
  }
}