import { client } from '../database';
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

describe("Product Model", () => {

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

  it("create method should add a new product", async () => {
    const result = await store.create({
      "name": 'Ilford HP5 Plus',
      "price": 6,
      "category": "film"
    });
    expect(result).toEqual({
      "id": 1,
      "name": "Ilford HP5 Plus",
      "price": 6,
      "category": "film"
    })
  })

  it("index method should return a list of products", async () => {    
    const result = await store.index();
    expect(result).not.toBe([]);
  })

  it("show method should return the correct product", async () => {
    const result = await store.show("1");
    expect(result).toEqual({
      "id": 1,
      "name": "Ilford HP5 Plus",
      "price": 6,
      "category": "film"
    });
  })

  it("delete method should delete the correct product", async () => {
    const deletedProduct = await store.delete("1");
    const indexProducts = await store.index();
    expect(indexProducts).not.toContain(deletedProduct)
  })

  // DB teardown
  afterAll(async () => {
    const conn = await client.connect();
    const sql = 'DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART with 1;';
    await conn.query(sql);
    conn.release();
  })
})