//* PRODUCT REQUEST HANDLERS *//
import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import { verifyAuthToken } from '../services/verifyAuthToken'
 
const store = new ProductStore();

// Show all Products handler
const index = async (_req: Request, res: Response):Promise<void> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}
// SHOW Product handler
const show = async (req: Request, res: Response):Promise<void> => {
  try {
    const product = await store.show(req.params.id);
    res.json(product);
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}
// CREATE Product handler
const create = async (req: Request, res: Response):Promise<void> => {
  const product: Product = {
    name: req.body.name,
    price: parseInt(`${req.body.price}`),
    category: req.body.category
  }
  try {
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch(err) {
    res.status(400);
    res.json(err);
  } 
}
// DELETE Product handler
const destroy = async(req: Request, res: Response):Promise<void> => {
  try {
    const deletedProduct = await store.delete(req.params.id);
    res.json(deletedProduct);
  } catch(err) {
    throw new Error(`Could not delete product. ${err}`)
  }
}

const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.post('/products/:id', verifyAuthToken, destroy);
}

export default product_routes;