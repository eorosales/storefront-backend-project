//* ORDER REQUEST HANDLERS *//
import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'

const store = new OrderStore();

// Show all orders method
const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
}


// Show order method
const show = async (req: Request, res: Response) => {
  const order = await store.show(req.params.id);
  res.json(order);
}

// Create a new order method
const create = async (req: Request, res: Response) => {
  const order:Order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
    userId: req.body.userId,
    status: req.body.status
  }
  
  const newOrder = await store.create(order);
  res.json(newOrder);
}

// Add product to order method
const addProduct = async (req: Request, res: Response) => {
  const orderId: number = req.params.id as unknown as number;
  const productId: number = req.body.productId;
  const quantity: number = req.body.quantity;
  
  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}

const order_routes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.post('/orders/:id/products', addProduct);
}

export default order_routes;
