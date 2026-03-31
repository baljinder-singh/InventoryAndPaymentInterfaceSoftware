import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import PaymentsPage from "./pages/PaymentsPage";
import WorkspacePage from "./pages/WorkspacePage";

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

const navigationItems = [
  { to: "/dashboard", label: "Dashboard", caption: "Overview and pulse", icon: "DB" },
  { to: "/inventory", label: "Inventory", caption: "Products and stock", icon: "IN" },
  { to: "/payments", label: "Payments", caption: "Collections and invoices", icon: "PY" },
  { to: "/workspace", label: "Workspace", caption: "Quick actions", icon: "WS" }
];

export default function App() {
  const [summary, setSummary] = useState({});
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [paymentForm, setPaymentForm] = useState(createEmptyPaymentForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const completedPayments = payments.filter((payment) => payment.status === "Completed");
  const pendingPayments = payments.filter((payment) => payment.status === "Pending");
  const collectionRate = payments.length ? Math.round((completedPayments.length / payments.length) * 100) : 0;
  const totalUnits = products.reduce((total, product) => total + product.stock, 0);
  const recentPayments = payments.slice(0, 4);
  const inventoryHealthLabel = lowStockItems.length ? "Needs attention" : "Healthy";

  const sharedProps = {
    summary,
    products,
    payments,
    lowStockItems,
    productForm,
    paymentForm,
    setProductForm,
    setPaymentForm,
    loading,
    error,
    loadData,
    handleProductSubmit,
    handlePaymentSubmit,
    completedPayments,
    pendingPayments,
    collectionRate,
    totalUnits,
    recentPayments,
    inventoryHealthLabel,
    formatCurrency
  };

  return (
    <BrowserRouter>
      <div className={`shell-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`.trim()}>
        <aside className="sidebar card">
          <div>
            <div className="sidebar-header-row">
              <div className="brand-block">
                <p className="eyebrow">North Star Console</p>
                <h1>Ops Hub</h1>
                <span>Inventory and payments</span>
              </div>
              <button
                className="collapse-button"
                type="button"
                onClick={() => setSidebarCollapsed((current) => !current)}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? ">" : "<"}
              </button>
            </div>

            <nav className="sidebar-nav">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`.trim()}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <div className="sidebar-link-copy">
                    <strong>{item.label}</strong>
                    <span>{item.caption}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="sidebar-footer">
            <p className="eyebrow">Live state</p>
            <div className="sidebar-stat">
              <span>Pending payments</span>
              <strong>{loading ? "..." : formatCurrency(summary.pendingAmount)}</strong>
            </div>
            <div className="sidebar-stat">
              <span>Low stock items</span>
              <strong>{loading ? "..." : lowStockItems.length}</strong>
            </div>
          </div>
        </aside>

        <section className="content-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage {...sharedProps} />} />
            <Route path="/inventory" element={<InventoryPage {...sharedProps} />} />
            <Route path="/payments" element={<PaymentsPage {...sharedProps} />} />
            <Route path="/workspace" element={<WorkspacePage {...sharedProps} />} />
          </Routes>
        </section>
      </div>
    </BrowserRouter>
  );
}
