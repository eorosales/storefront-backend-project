//* USER MODEL *//
import { client } from '../database'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

// Allow access to .env
dotenv.config();

// User type
export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  password: string;
}

export class UserStore {
  // Show all users method
  async index():Promise<User[]> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }
  // Show selected User by id method
  async show(id:string):Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      console.log(result.rows)
      return result.rows[0];
    } catch(err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`) 
    }
  }
  // Create new User method
  async create(u:User):Promise<User> {
    const sql = 'INSERT INTO users (first_name, last_name, password_digest) VALUES ($1, $2, $3) RETURNING *';
    const conn = await client.connect();
    const hash = bcrypt.hashSync(
      u.password + 'pepper', 
      parseInt(`${process.env.SALT_ROUNDS}`)
    );
    const result = await conn.query(sql, [u.firstName, u.lastName, hash]);
    conn.release(); 
    return result.rows[0];
  }
  // Authenticate user and password method
  async authenticate(firstName: string, lastName: string, password: string):Promise<User | null> {
    const conn = await client.connect();
    const sql = 'SELECT password_digest FROM users WHERE first_name=($1) AND last_name=($2)';
    const result = await conn.query(sql, [firstName, lastName]);
    if(result.rows) {
      const user = result.rows[0];
      if(bcrypt.compareSync(password+'pepper', user.password_digest)) {
        return user;
      }
    }
    return null;
  }
}