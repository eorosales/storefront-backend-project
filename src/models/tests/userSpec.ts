import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { client } from '../../database';
import { UserStore } from '../user';

dotenv.config();
const store = new UserStore();

describe("User Model", () => {
  const user = {
    "firstName": "test",
    "lastName": "user", 
    "password": "password123"
  }

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  })

  it("should have show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have create method", () => {
    expect(store.create).toBeDefined();
  })

  describe("create method", () => {

    it("creates new user", async () => {
      const newUser = await store.create(user);
      expect(newUser).toBeDefined();
    })

    it("encrypts password", async () => {
      await store.create(user);
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE first_name=($1) AND last_name=($2)';
      const result = await conn.query(sql, ["test", "user"]);
      expect(result.rows[0].password_digest).not.toBe(user.password);
    })
  })

  it("shows the correct user", async () => {
    const showUser = await store.show("1");
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE id=($1)';
    const result = await conn.query(sql, [1]);
    conn.release();
    expect(showUser).toEqual(result.rows[0]);
  })

  it("authenticates user", async () => {
    const u = await store.authenticate(user.firstName, user.lastName, user.password);
    const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string);
    expect(token).toBeDefined();
  })

  afterAll(async() => {
    const conn = await client.connect();
    const sql = 'DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART with 1';
    await conn.query(sql);
    conn.release();
  })
})