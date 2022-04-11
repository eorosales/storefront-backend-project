//* USER REQUEST HANDLERS *//
import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { verifyAuthToken } from '../services/verifyAuthToken'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'

dotenv.config();
const store = new UserStore();

// INDEX Users Handler
const index = async (_req: Request, res: Response):Promise<void> => {
  const users = await store.index();
  console.log(process.env.TOKEN_SECRET as string);
  res.json(users);
}

// READ User Handler
const show = async (req: Request, res: Response):Promise<void> => {
  const user:User = await store.show(req.params.id);
  res.json(user);
}

// CREATE User Handler
const create = async (_req: Request, res: Response):Promise<void> => {
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

// DELETE User Handler
const destroy = async (req: Request, res: Response):Promise<void> => {
  const deletedUser = await store.delete(req.params.id);
  res.json(deletedUser);
}

// Authenticate User Handler
const authenticate = async (req: Request, res: Response):Promise<void> => {
  const user: User = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    password: req.body.password
  }
  const u = await store.authenticate(user.firstName, user.lastName, user.password);
  const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string);
  res.json(token)
}

// User Model Endpoints
const user_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate)
  app.delete('/users/:id', verifyAuthToken, destroy);
}

export default user_routes;