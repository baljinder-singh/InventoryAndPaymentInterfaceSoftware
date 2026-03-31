import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { navigationItems } from "./data/auth";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import PaymentsPage from "./pages/PaymentsPage";
import WorkspacePage from "./pages/WorkspacePage";

const API_BASE_URL = "http://localhost:4000/api";
const SESSION_STORAGE_KEY = "ops-hub-session";

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

function AppContent() {
  const [summary, setSummary] = useState({});
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [paymentForm, setPaymentForm] = useState(createEmptyPaymentForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [session, setSession] = useState(() => {
    const saved = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();

  const currentUser = session?.user || null;
  const authToken = session?.token || "";

  function saveSession(nextSession) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function clearSession() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }

  async function apiRequest(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      clearSession();
      throw new Error("Your session expired. Please sign in again.");
    }

    if (response.status === 403) {
      throw new Error("You do not have permission to perform this action.");
    }

    return response;
  }

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const requests = [apiRequest("/dashboard")];

      if (currentUser?.role === "admin" || currentUser?.role === "inventory_manager") {
        requests.push(apiRequest("/products"));
      } else {
        requests.push(Promise.resolve(null));
      }

      if (currentUser?.role === "admin" || currentUser?.role === "accountant") {
        requests.push(apiRequest("/payments"));
      } else {
        requests.push(Promise.resolve(null));
      }

      const [dashboardRes, productsRes, paymentsRes] = await Promise.all(requests);

      if (!dashboardRes.ok || (productsRes && !productsRes.ok) || (paymentsRes && !paymentsRes.ok)) {
        throw new Error("Unable to load application data.");
      }

      const dashboardData = await dashboardRes.json();
      const productData = productsRes ? await productsRes.json() : [];
      const paymentData = paymentsRes ? await paymentsRes.json() : [];

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
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  async function handleProductSubmit(event) {
    event.preventDefault();

    try {
      const response = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(productForm)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Unable to save product.");
      }

      setProductForm(emptyProductForm);
      loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handlePaymentSubmit(event) {
    event.preventDefault();

    try {
      const response = await apiRequest("/payments", {
        method: "POST",
        body: JSON.stringify(paymentForm)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Unable to save payment.");
      }

      setPaymentForm(createEmptyPaymentForm());
      loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setIsAuthenticating(true);
    setLoginError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to sign in.");
      }

      saveSession(data);
      setEmail("");
      setPassword("");
    } catch (authError) {
      setLoginError(authError.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  function handleLogout() {
    clearSession();
    setSidebarCollapsed(false);
  }

  const allowedNavigationItems = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return navigationItems.filter((item) => item.roles.includes(currentUser.role));
  }, [currentUser]);

  const defaultRoute = allowedNavigationItems[0]?.to || "/dashboard";
  const currentPathAllowed = allowedNavigationItems.some((item) => item.to === location.pathname);

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
    formatCurrency,
    currentUser
  };

  if (!currentUser) {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <LoginPage
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              onLogin={handleLogin}
              loginError={loginError}
              isAuthenticating={isAuthenticating}
            />
          }
        />
      </Routes>
    );
  }

  return (
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

          <div className="user-card">
            <div className="user-avatar">{currentUser.name.slice(0, 2).toUpperCase()}</div>
            <div className="user-copy">
              <strong>{currentUser.name}</strong>
              <span>{currentUser.roleLabel}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {allowedNavigationItems.map((item) => (
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
          <button className="ghost-button sidebar-logout" type="button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      <section className="content-shell">
        <Routes>
          <Route path="/login" element={<Navigate to={defaultRoute} replace />} />
          <Route path="/" element={<Navigate to={defaultRoute} replace />} />
          <Route path="/dashboard" element={allowedNavigationItems.some((item) => item.to === "/dashboard") ? <DashboardPage {...sharedProps} /> : <Navigate to={defaultRoute} replace />} />
          <Route path="/inventory" element={allowedNavigationItems.some((item) => item.to === "/inventory") ? <InventoryPage {...sharedProps} /> : <Navigate to={defaultRoute} replace />} />
          <Route path="/payments" element={allowedNavigationItems.some((item) => item.to === "/payments") ? <PaymentsPage {...sharedProps} /> : <Navigate to={defaultRoute} replace />} />
          <Route path="/workspace" element={allowedNavigationItems.some((item) => item.to === "/workspace") ? <WorkspacePage {...sharedProps} /> : <Navigate to={defaultRoute} replace />} />
          <Route path="*" element={<Navigate to={currentPathAllowed ? location.pathname : defaultRoute} replace />} />
        </Routes>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
