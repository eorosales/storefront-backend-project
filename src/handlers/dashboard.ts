import express, { Request, Response } from 'express'
import { DashboardQueries } from '../services/dashboard';

const dashboard = new DashboardQueries();

const productsWithOrders = async (req: Request, res: Response) => {
  const products = await dashboard.productsInOrder();
  res.json(products);
}

const dashboard_routes = (app: express.Application) => {
  app.get('/products-in-order', productsWithOrders);
}

export default dashboard_routes;
