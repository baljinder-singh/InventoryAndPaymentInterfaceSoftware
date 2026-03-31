# InventoryAndPaymentInterfaceSoftware

Inventory and payment management starter built with React, Node.js, and Express.

## What this includes

- Inventory dashboard with stock summary and low-stock alerts
- Product listing with add-product flow
- Payment listing with add-payment flow
- Express API with JWT-based authentication and role-protected routes
- Clean project split into `client` and `server`

## Project structure

```text
.
|-- client
|   |-- src
|   |   |-- components
|   |   |-- pages
|   |   |-- styles
|-- server
|   |-- src
|       |-- data
|       |-- middleware
|       |-- routes
|       |-- utils
```

## Run locally

### 1. Configure the backend

Create your environment file from the example if needed:

```bash
cd server
copy .env.example .env
```

Then set a strong `JWT_SECRET` value inside `.env`.

### 2. Start both apps together

From the project root:

```bash
npm install
npm run dev
```

This runs:

- Backend on `http://localhost:4000`
- Frontend on `http://localhost:5173`

## Demo login accounts

- `admin@opshub.local` / `admin123`
- `inventory@opshub.local` / `inventory123`
- `accounts@opshub.local` / `accounts123`

## Current scope

This is still an MVP foundation. Authentication now uses JWTs and hashed passwords on the server, but users are still stored in in-memory seed data. The next production step would be moving users, products, and payments into a real database and hashing new passwords during user creation.
