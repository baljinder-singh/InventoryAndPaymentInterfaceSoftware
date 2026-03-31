import { useEffect, useState } from "react";
import LowStockList from "./components/LowStockList";
import PaymentTable from "./components/PaymentTable";
import ProductTable from "./components/ProductTable";
import SummaryCard from "./components/SummaryCard";

const API_BASE_URL = "http://localhost:4000/api";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);
}

const emptyProductForm = {
  name: "",
  category: "",
  sku: "",
  price: "",
  stock: "",
  reorderLevel: ""
};

const createEmptyPaymentForm = () => ({
  invoiceNumber: "",
  customerName: "",
  amount: "",
  method: "UPI",
  status: "Pending",
  date: new Date().toISOString().slice(0, 10)
});

export default function App() {
  const [summary, setSummary] = useState({});
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [paymentForm, setPaymentForm] = useState(createEmptyPaymentForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [dashboardRes, productsRes, paymentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard`),
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/payments`)
      ]);

      if (!dashboardRes.ok || !productsRes.ok || !paymentsRes.ok) {
        throw new Error("Unable to load application data.");
      }

      const dashboardData = await dashboardRes.json();
      const productData = await productsRes.json();
      const paymentData = await paymentsRes.json();

      setSummary(dashboardData.summary);
      setLowStockItems(dashboardData.lowStockItems);
      setProducts(productData);
      setPayments(paymentData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleProductSubmit(event) {
    event.preventDefault();

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productForm)
    });

    if (response.ok) {
      setProductForm(emptyProductForm);
      loadData();
    }
  }

  async function handlePaymentSubmit(event) {
    event.preventDefault();

    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentForm)
    });

    if (response.ok) {
      setPaymentForm(createEmptyPaymentForm());
      loadData();
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Operations cockpit</p>
          <h1>Inventory and payment control in one place.</h1>
          <p className="hero-copy">
            Use this starter to track products, restocking pressure, invoice
            collections, and day-to-day cash movement.
          </p>
        </div>
        <div className="hero-note card">
          <strong>Starter scope</strong>
          <p>
            This version stores data in memory for fast prototyping. It is ready
            to upgrade to MongoDB, PostgreSQL, and a real payment gateway.
          </p>
        </div>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <section className="summary-grid">
        <SummaryCard
          title="Products"
          value={loading ? "..." : summary.totalProducts || 0}
          helper="Active catalog items"
        />
        <SummaryCard
          title="Inventory Value"
          value={loading ? "..." : formatCurrency(summary.inventoryValue)}
          helper="Current stock valuation"
        />
        <SummaryCard
          title="Collected Payments"
          value={loading ? "..." : formatCurrency(summary.collectedAmount)}
          helper="Completed payment total"
        />
        <SummaryCard
          title="Pending Payments"
          value={loading ? "..." : formatCurrency(summary.pendingAmount)}
          helper="Awaiting collection"
        />
      </section>

      <section className="content-grid">
        <LowStockList items={lowStockItems} />

        <div className="card form-card">
          <div className="section-heading">
            <h2>Add Product</h2>
            <p>Capture new items before they enter stock movement.</p>
          </div>
          <form className="form-grid" onSubmit={handleProductSubmit}>
            <input
              placeholder="Product name"
              value={productForm.name}
              onChange={(event) =>
                setProductForm({ ...productForm, name: event.target.value })
              }
              required
            />
            <input
              placeholder="Category"
              value={productForm.category}
              onChange={(event) =>
                setProductForm({ ...productForm, category: event.target.value })
              }
              required
            />
            <input
              placeholder="SKU"
              value={productForm.sku}
              onChange={(event) =>
                setProductForm({ ...productForm, sku: event.target.value })
              }
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Price"
              value={productForm.price}
              onChange={(event) =>
                setProductForm({ ...productForm, price: event.target.value })
              }
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Stock"
              value={productForm.stock}
              onChange={(event) =>
                setProductForm({ ...productForm, stock: event.target.value })
              }
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Reorder level"
              value={productForm.reorderLevel}
              onChange={(event) =>
                setProductForm({
                  ...productForm,
                  reorderLevel: event.target.value
                })
              }
              required
            />
            <button type="submit">Save Product</button>
          </form>
        </div>
      </section>

      <section className="content-grid">
        <div className="card form-card">
          <div className="section-heading">
            <h2>Add Payment</h2>
            <p>Record invoice collection and monitor settlement status.</p>
          </div>
          <form className="form-grid" onSubmit={handlePaymentSubmit}>
            <input
              placeholder="Invoice number"
              value={paymentForm.invoiceNumber}
              onChange={(event) =>
                setPaymentForm({
                  ...paymentForm,
                  invoiceNumber: event.target.value
                })
              }
              required
            />
            <input
              placeholder="Customer name"
              value={paymentForm.customerName}
              onChange={(event) =>
                setPaymentForm({
                  ...paymentForm,
                  customerName: event.target.value
                })
              }
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Amount"
              value={paymentForm.amount}
              onChange={(event) =>
                setPaymentForm({ ...paymentForm, amount: event.target.value })
              }
              required
            />
            <select
              value={paymentForm.method}
              onChange={(event) =>
                setPaymentForm({ ...paymentForm, method: event.target.value })
              }
            >
              <option>UPI</option>
              <option>Card</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
            </select>
            <select
              value={paymentForm.status}
              onChange={(event) =>
                setPaymentForm({ ...paymentForm, status: event.target.value })
              }
            >
              <option>Pending</option>
              <option>Completed</option>
              <option>Failed</option>
            </select>
            <input
              type="date"
              value={paymentForm.date}
              onChange={(event) =>
                setPaymentForm({ ...paymentForm, date: event.target.value })
              }
            />
            <button type="submit">Save Payment</button>
          </form>
        </div>

        <LowStockList items={lowStockItems.slice(0, 2)} />
      </section>

      <ProductTable products={products} />
      <PaymentTable payments={payments} />
    </main>
  );
}
