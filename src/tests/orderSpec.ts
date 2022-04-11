import { client } from '../database';
import { Order, OrderStore } from '../models/order'

const store = new OrderStore();

describe("Order Model", () => {

  const o:Order = {
    "productId": 1,
    "quantity": 10,
    "userId": 1,
    "status": "open"
  }

  beforeAll(async () => {
    const conn = await client.connect();

    const sqlProduct = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';
    const sqlUser = 'INSERT INTO users (first_name, last_name, password_digest) VALUES ($1, $2, $3) RETURNING *';
    
    await conn.query(sqlProduct, ["test", 100, "test category"]);
    await conn.query(sqlUser, ["first", "last", "password"]);

    conn.release();
  })

  it("should have index method", () => {
    expect(store.index).toBeDefined();
  })

  it("should have show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have create method", () => {
    expect(store.create).toBeDefined();
  })

  it("should have delete method", () => {
    expect(store.delete).toBeDefined();
  })

  it("create method should add a new order", async() => {
    const result = await store.create(o);
    const index = await store.index();
    expect(index).toContain(result);
  })

  it("index method should return a list of orders", async() => {
    const result = await store.index();
    expect(result).toBeDefined();
  })

  it("show method should return the correct order", async() => {
    const order = await store.show("1");
    expect(order).toBeDefined();
  })

  it("delete method should delete the correct order", async() => {
    const deletedOrder = await store.delete("1");
    const index = await store.index();
    expect(index).not.toContain(deletedOrder);
  })

  //DB teardown
  afterAll(async () => {
    const conn = await client.connect();
    
    const sqlOrdersReset = 'DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART with 1;'
    const sqlProductsReset = 'DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART with 1;';
    const sqlUsersReset = 'DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART with 1;';
    
    await conn.query(sqlOrdersReset);
    await conn.query(sqlProductsReset);
    await conn.query(sqlUsersReset);
    
    
    conn.release();
  })
})
