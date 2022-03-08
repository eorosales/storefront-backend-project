import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
}

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.body.id);
  res.json(user);
}

const user_routes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
}

export default user_routes;