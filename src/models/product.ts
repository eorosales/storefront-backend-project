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
  // Show all Products 
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
  // READ Product by id 
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
  // CREATE Product
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
  // UPDATE Product
  async update(p:Product):Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'UPDATE products SET name=$2, price=$3, category=$4 WHERE id=$1 RETURNING *';
      const result = await conn.query(sql, [p.id, p.name, p.price, p.category]);
      conn.release();
      return result.rows[0]; 
    } catch(err){
      throw new Error(`Could not update ${err}`)
    }
  }
  // DELETE Product
  async delete(id:string):Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    }catch(err) {
      throw new Error(`Coudl not delete Product. ${err}`)
    }
  }
}