import { Router } from "express";
import { store } from "../data/store.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(store.products);
});

router.post("/", (req, res) => {
  const { name, category, sku, price, stock, reorderLevel } = req.body;

  if (!name || !category || !sku) {
    return res.status(400).json({ message: "Name, category, and SKU are required." });
  }

  const product = {
    id: `PRD-${Date.now()}`,
    name,
    category,
    sku,
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    reorderLevel: Number(reorderLevel) || 0
  };

  store.products.unshift(product);
  return res.status(201).json(product);
});

export default router;
