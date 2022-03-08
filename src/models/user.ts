import client from '../database'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config();

export type User = {
  id: number,
  first_name: string;
  last_name: string;
  password: string;
}

export class UserStore {
  // Show all users
  async index():Promise<User[]> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;;
  }
  // Show selected User by id
  async show(id:string):Promise<User> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE id = ($1);';
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }
  // Create new User
  async create(u:User):Promise<User> {
    const conn = await client.connect();
    const sql = 'INSERT INTO users (first_name, last_name, password_digest) VALUES ($1, $2, $3)';
    const hash = bcrypt.hashSync(
      u.password + 'pepper', 
      parseInt(`${process.env.SALT_ROUNDS}`)
    );
    const result = await conn.query(sql, [u.first_name, u.last_name, hash]);
    conn.release();
    const user = result.rows[0];
    return user;
  }
  
  async authenticate(firstName: string, lastName: string, password: string):Promise<User | null> {
    const conn = await client.connect();
    const sql = 'SELECT password_digest FROM users WHERE first_name=($1) AND last_name=($2)';
    const result = await conn.query(sql, [firstName, lastName]);
    console.log(password+'pepper');
    if(result.rows) {
      const user = result.rows[0];
      console.log(user);
      if(bcrypt.compareSync(password+'pepper', user.password_digest)) {
        return user;
      }
    }
    return null;
  }
}