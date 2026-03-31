import cors from "cors";
import express from "express";
import { store } from "./data/store.js";
import { requireAuth, requireRole } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { buildSummary } from "./utils/summary.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

app.get("/api/dashboard", requireAuth, (_req, res) => {
  res.json({
    summary: buildSummary(store.products, store.payments),
    lowStockItems: store.products.filter(
      (product) => product.stock <= product.reorderLevel
    )
  });
});

app.use(
  "/api/products",
  requireAuth,
  requireRole(["admin", "inventory_manager"]),
  inventoryRoutes
);

app.use(
  "/api/payments",
  requireAuth,
  requireRole(["admin", "accountant"]),
  paymentRoutes
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
