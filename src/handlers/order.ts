//* ORDER REQUEST HANDLERS *//
import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import { verifyAuthToken } from '../services/verifyAuthToken'

const store = new OrderStore();

// Show all Orders 
const index = async (_req: Request, res: Response):Promise<void> => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}


// SHOW Order by id
const show = async (req: Request, res: Response):Promise<void> => {
  try {
    const order = await store.show(req.params.id);
    res.json(order);
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}

// CREATE Order
const create = async (req: Request, res: Response):Promise<void> => {
  const order:Order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
    userId: req.body.userId,
    status: req.body.status
  }
  
  try {
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}

// DELETE Order
const destroy = async (req: Request, res: Response):Promise<void> => {
  try {
    const deletedOrder = await store.delete(req.params.id);
    res.json(deletedOrder);
  } catch(err) {
    res.status(400);
    res.json(err)
  }
}

// Add Product to Order
const addProduct = async (req: Request, res: Response):Promise<void> => {
  const orderId: string = req.params.id;
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
  app.get('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
  app.delete('/orders/:id', verifyAuthToken, destroy);
}

export default order_routes;
