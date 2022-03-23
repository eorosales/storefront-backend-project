//* PRODUCT MODEL *//
import { client } from '../database';

// Product type
export type Product = {
  id?: number
  name: string,
  price: number,
  category: string
}

export class ProductStore {
  // Show all products method
  async index():Promise<Product[]> {  
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch(err) {
      throw new Error(`Could not find products. Error: ${err}`);
    }
  }
  // Show product by id method
  async show(id:string):Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      const product = result.rows[0];
      return product;
    } catch(err) {
      throw new Error(`Could not find product with id of ${id}. Error: ${err}`);
    }
  }
  // Create product method
  async create(p:Product):Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p. category]);
      conn.release();
      const product = result.rows[0];
      return product;
    } catch(err) {
      throw new Error(`Could not create a new product. Error: ${err}`)
    }
  }
  // Delete product method
  async delete(id:string):Promise<Product> {
    const conn = await client.connect();
    const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }
}