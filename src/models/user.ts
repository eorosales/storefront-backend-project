import client from '../database'

export type User = {
  id: number,
  first_name: string;
  last_name: string;
  password_digest: string;
}

export class UserStore {
  //TODO: Index
  async index():Promise<User[]> {
    const conn = await client.connect();
    const sql = 'SELECT * FROM users';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;;
  }
  //TODO: Show
  async show(id:string):Promise<User> {
    const conn = await client.connect();
    const sql = 'SELECT FROM users WHERE id = ($1)';
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }
  //TODO: Create
  async create(u:User):Promise<User> {
    const conn = await client.connect();
    const sql = 'INSERT INTO users (first_name, last_name, password_digest) VALUES ($1, $2, $3)';
    const result = await conn.query(sql, [u.first_name, u.last_name, u.password_digest]);
    conn.release();
    const user = result.rows[0];
    return user;
  }
}