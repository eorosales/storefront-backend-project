//* PRODUCT REQUEST HANDLERS *//
import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import { verifyAuthToken } from '../services/verifyAuthToken'
 
const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
}

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  res.json(product);
}

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
  }

  const newProduct = await store.create(product);
  res.json(newProduct);
}


const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
}

export default product_routes;