# InventoryAndPaymentInterfaceSoftware

Inventory and payment management starter built with React, Node.js, and Express.

## What this includes

- Inventory dashboard with stock summary and low-stock alerts
- Product listing with add-product flow
- Payment listing with add-payment flow
- Express API with starter in-memory data
- Clean project split into `client` and `server`

## Project structure

```text
.
|-- client
|   |-- src
|   |   |-- components
|   |   |-- styles
|-- server
|   |-- src
|       |-- data
|       |-- routes
|       |-- utils
```

## Run locally

From the project root, you can now start both apps together:

```bash
npm install
npm run dev
```

This runs:

- Backend on `http://localhost:4000`
- Frontend on `http://localhost:5173`

If you prefer, you can still run them separately in two terminals.

### 1. Start the backend

```bash
cd server
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Current scope

This is an MVP foundation. Payment handling is modeled as internal transaction tracking for invoices and received payments. If you want, the next step can be integrating a real provider such as Stripe, Razorpay, or PayPal.
