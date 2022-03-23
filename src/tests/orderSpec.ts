import { Order, OrderStore } from '../models/order'

const store = new OrderStore();

describe("Order Model", () => {

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  })

  it("index method should return a list of orders", async() => {
    const result = await store.index();
    expect(result).toBeDefined();
  })

  it("should have show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have create method", () => {
    expect(store.create).toBeDefined();
  })
})
