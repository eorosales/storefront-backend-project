//* USER REQUEST HANDLERS *//
import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { verifyAuthToken } from '../services/verifyAuthToken'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'

dotenv.config();
const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  console.log(process.env.TOKEN_SECRET as string);
  res.json(users);
}

const show = async (req: Request, res: Response) => {
  const user:User = await store.show(req.params.id);
  res.json(user);
}

const create = async (_req: Request, res: Response) => {
  const user: User = {
    firstName: _req.body.first_name as string,
    lastName: _req.body.last_name as string,
    password: _req.body.password as string
  }
 
  try { 
    const newUser = await store.create(user);
    let token = jwt.sign(newUser, process.env.TOKEN_SECRET as jwt.Secret);
    res.json(token);
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    password: req.body.password
  }
  const u = await store.authenticate(user.firstName, user.lastName, user.password);
  const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string);
  res.json(token)
}

const user_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate)
}

export default user_routes;