import { Router } from "express";
import { store } from "../data/store.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(store.payments);
});

router.post("/", (req, res) => {
  const { invoiceNumber, customerName, amount, method, status, date } = req.body;

  if (!invoiceNumber || !customerName || !amount || !method) {
    return res.status(400).json({
      message: "Invoice number, customer name, amount, and method are required."
    });
  }

  const payment = {
    id: `PAY-${Date.now()}`,
    invoiceNumber,
    customerName,
    amount: Number(amount),
    method,
    status: status || "Pending",
    date: date || new Date().toISOString().slice(0, 10)
  };

  store.payments.unshift(payment);
  return res.status(201).json(payment);
});

export default router;
