import { client } from '../../database';
import { Product, ProductStore } from '../product';

const store = new ProductStore();

const testReset = async () => {
  const conn = await client.connect();
  const sql = 'ALTER SEQUENCE products_id_seq RESTART with 1;';
  await conn.query(sql);
  conn.release();
}

testReset();

describe("Product Model", () => {

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  })

  it("index method should return a list of products", () => {    
    expect(store.index()).toBeDefined();
  })

  it("should have show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have create method", () => {
    expect(store.create).toBeDefined();
  })

  it("create method should add a new product", async () => {
    const result = await store.create({
      "name": 'Ilford HP5 Plus',
      "price": 6,
      "category": "film"
    });
    expect(result).toEqual({
      "id": 1,
      "name": 'Ilford HP5 Plus',
      "price": 6,
      "category": "film"
    })
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

  it("delete method should remove the product", async () => {
    await store.delete("1");
    const result = await store.index();
    expect(result).toEqual([]); 
  })
})