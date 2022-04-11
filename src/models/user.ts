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
  // Show all Users
  async index():Promise<User[]> {
    try {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
    } catch(err) {
      throw new Error(`Not able to index users. ${err}`)
    }
  }
  // Show selected User by id
  async show(id:string):Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch(err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`) 
    }
  }
  // Create new User
  async create(u:User):Promise<User> {
    try {
      const sql = 'INSERT INTO users (first_name, last_name, password_digest) VALUES ($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      // Encrypt password on User creation
      const hash = bcrypt.hashSync(
        u.password + 'pepper', 
        parseInt(`${process.env.SALT_ROUNDS}`)
      );
      const result = await conn.query(sql, [u.firstName, u.lastName, hash]);
      conn.release(); 
      return result.rows[0];
    } catch(err) {
      throw new Error(`Could not create user new user for ${u.firstName} ${u.lastName}`);
    }
  }

  // Destroy User
  async delete(id:string):Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch(err) {
      throw new Error(`Could not delete user. ${err}`)
    }
  }

  // Authenticate user and password
  async authenticate(firstName: string, lastName: string, password: string):Promise<User | null> {
    try {
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
    } catch(err) {
      throw new Error(`Could not authenticate user. ${err}`)
    }
  }
}