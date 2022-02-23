import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  res.send(`Index is hooked up!`)
}

const product_routes = (app: express.Application) => {
  app.get('/product', index);
}

export default product_routes;