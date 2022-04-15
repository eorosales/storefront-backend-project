# Storeront Backend Project

## Techologies Used

This project makes use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Project Set Up

Clone the repository onto your local machine or download the project files and cd into the storefront-backend-project directory.

```
git clone https://github.com/eorosales/storefront-backend-project.git
cd storefront-backend-project
```

Run yarn in the terminal at the project root to install all necessary packages.

```
yarn
```

Start up the application stack using the included _docker-compose.yaml_ configuration file.

```
docker-compose up
```

Run necessary database migrations to set up the database.

```
db-migrate up
```

Run yarn watch to build the distribution folder and spin up the server.

```
yarn watch
```

With the project sturcture properly set up, the backend will be running on _port 3000_ and the database exposed on _port 5432_.
The project and database is now properly set up to handle requests using the following provided API endpoints.

---

## Testing

Once the project is set up, you can run tests utilizing the Jasmine library. Run the following in terminal to run the testing suite.

```
yarn test
```

---

## RESTful API Routes and Endpoints

The following is a map of the database tables, their schemas, routes and associated endpoints.

### Products API Routes

| Method | Description            | Verb | Endpoint                            |
| ------ | ---------------------- | ---- | ----------------------------------- |
| Index  | Show all Products      | GET  | http://localhost:3000/products      |
| Show   | Show a Product by id   | GET  | http://localhost:3000/products/{id} |
| Create | Add a new Product row  | POST | http://localhost:3000/products      |
| Delete | Delete a Product by id | DEL  | http://localhost:3000/products/{id} |

### Products Table Scehma

| Column   | Type               |
| -------- | ------------------ |
| id       | SERIAL PRIMARY KEY |
| name     | VARCHAR(255)       |
| price    | integer            |
| category | VARCHAR(255)       |

### Users API Routes

| Method       | Description         | Verb | Endpoint                                 |
| ------------ | ------------------- | ---- | ---------------------------------------- |
| Index        | Show all Users      | GET  | http://localhost:3000/users              |
| Show         | Show a User by id   | GET  | http://localhost:3000/users/{id}         |
| Create       | Add a new User row  | POST | http://localhost:3000/users              |
| Authenticate | Authenticate User   | POST | http://localhost:3000/users/authenticate |
| Delete       | Delete a User by id | DEL  | http://localhost:3000/users/{id}         |

### Users Table Schema

| Column          | Type               |
| --------------- | ------------------ |
| id              | SERIAL PRIMARY KEY |
| first_name      | VARCHAR(255)       |
| last_name       | VARCHAR(255)       |
| password_digest | VARCHAR(255)       |

### Orders API Routes

| Method     | Description            | Verb | Endpoint                                        |
| ---------- | ---------------------- | ---- | ----------------------------------------------- |
| Index      | Show all Orders        | GET  | http://localhost:3000/users                     |
| Show       | Show an Order by id    | GET  | http://localhost:3000/users/{id}                |
| Create     | Add a new Order row    | POST | http://localhost:3000/users                     |
| AddProduct | Add a Product to Order | POST | http://localhost:3000/users/{order.id}/products |  |
| Delete     | Delete an Order by id  | DEL  | http://localhost:3000/users/{id}                |

### Orders Table Schema

| Column     | Type               | Reference    |
| ---------- | ------------------ | ------------ |
| id         | SERIAL PRIMARY KEY |              |
| product_id | INTEGER REFERENCES | products(id) |
| quantity   | integer            |              |
| user_id    | INTEGER REFERENCES | users(id)    |
| status     | VARCHAR(10)        |              |
