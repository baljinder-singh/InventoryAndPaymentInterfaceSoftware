import cors from "cors";
import express from "express";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { store } from "./data/store.js";
import { buildSummary } from "./utils/summary.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/dashboard", (_req, res) => {
  res.json({
    summary: buildSummary(store.products, store.payments),
    lowStockItems: store.products.filter(
      (product) => product.stock <= product.reorderLevel
    )
  });
});

app.use("/api/products", inventoryRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
