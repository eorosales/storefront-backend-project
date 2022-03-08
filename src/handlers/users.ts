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

const create = async (req: Request, res: Response) => {
  const u: User = {
    id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password
  }
  const newUser: User = await store.create(u);
  res.json(newUser);
}

const authenticate = async (req: Request, res: Response) => {
  const authenticated = await store.authenticate(req.body.first_name, req.body.last_name, req.body.password);
  res.json(authenticated)
}

const user_routes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate)
}

export default user_routes;