import LowStockList from "../components/LowStockList";
import MiniBarChart from "../components/MiniBarChart";
import SummaryCard from "../components/SummaryCard";

export default function DashboardPage({
  summary,
  lowStockItems,
  loading,
  error,
  completedPayments,
  pendingPayments,
  collectionRate,
  totalUnits,
  recentPayments,
  inventoryHealthLabel,
  formatCurrency,
  loadData
}) {
  const dashboardChartItems = [
    {
      label: "Collected",
      value: summary.collectedAmount || 0,
      width: Math.max(collectionRate, 10),
      tone: "tone-teal"
    },
    {
      label: "Pending",
      value: summary.pendingAmount || 0,
      width: Math.max(100 - collectionRate, 10),
      tone: "tone-gold"
    },
    {
      label: "Low stock",
      value: lowStockItems.length,
      width: lowStockItems.length ? Math.min(lowStockItems.length * 20, 100) : 12,
      tone: "tone-rose"
    }
  ];

  return (
    <main className="page-shell">
      <section className="page-topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Operations overview</h2>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button" type="button">Live Sync</button>
          <button className="primary-button" type="button" onClick={loadData}>Refresh Data</button>
        </div>
      </section>

      <section className="hero-panel card">
        <div className="hero-copy-wrap">
          <span className="status-dot">Realtime operations</span>
          <h3>See stock risk, collection progress, and catalog movement from one calm dashboard.</h3>
          <p className="hero-copy">
            Your left navigation now opens dedicated pages, while the dashboard keeps the big-picture numbers front and center.
          </p>
          <div className="hero-highlights">
            <div>
              <strong>{loading ? "..." : totalUnits}</strong>
              <span>Units in stock</span>
            </div>
            <div>
              <strong>{loading ? "..." : `${collectionRate}%`}</strong>
              <span>Collection rate</span>
            </div>
            <div>
              <strong>{inventoryHealthLabel}</strong>
              <span>Inventory health</span>
            </div>
          </div>
        </div>
        <div className="hero-side-panel">
          <p className="eyebrow">Today snapshot</p>
          <div className="snapshot-value">{loading ? "..." : formatCurrency(summary.collectedAmount)}</div>
          <p className="snapshot-copy">Collected revenue currently recorded in the system.</p>
          <div className="mini-metrics">
            <div>
              <span>Pending</span>
              <strong>{loading ? "..." : formatCurrency(summary.pendingAmount)}</strong>
            </div>
            <div>
              <span>Low stock</span>
              <strong>{loading ? "..." : lowStockItems.length}</strong>
            </div>
          </div>
        </div>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <section className="summary-grid">
        <SummaryCard title="Products" value={loading ? "..." : summary.totalProducts || 0} helper="Active catalog items" accent="accent-blue" />
        <SummaryCard title="Inventory Value" value={loading ? "..." : formatCurrency(summary.inventoryValue)} helper="Current stock valuation" accent="accent-gold" />
        <SummaryCard title="Collected Payments" value={loading ? "..." : formatCurrency(summary.collectedAmount)} helper="Completed payment total" accent="accent-green" />
        <SummaryCard title="Pending Payments" value={loading ? "..." : formatCurrency(summary.pendingAmount)} helper="Awaiting collection" accent="accent-rose" />
      </section>

      <section className="dashboard-grid triple-grid">
        <LowStockList items={lowStockItems} />

        <div className="card insight-card">
          <div className="section-heading">
            <h2>Collections Pulse</h2>
            <p>A quick read on incoming money and settlement speed.</p>
          </div>
          <div className="pulse-grid">
            <div className="pulse-stat">
              <span>Completed</span>
              <strong>{completedPayments.length}</strong>
            </div>
            <div className="pulse-stat">
              <span>Pending</span>
              <strong>{pendingPayments.length}</strong>
            </div>
            <div className="pulse-stat wide">
              <span>Collection rate</span>
              <strong>{collectionRate}%</strong>
            </div>
          </div>
          <div className="progress-rail">
            <span style={{ width: `${collectionRate}%` }} />
          </div>
        </div>

        <MiniBarChart
          title="Cashflow mix"
          description="A quick visual split between collected, pending, and stock pressure."
          items={dashboardChartItems}
          formatter={formatCurrency}
        />
      </section>

      <section className="dashboard-grid bottom-grid">
        <div className="card activity-card">
          <div className="section-heading section-heading-inline">
            <div>
              <p className="eyebrow">Feed</p>
              <h2>Recent Payment Activity</h2>
            </div>
            <p>Latest money movement recorded by the team.</p>
          </div>
          <div className="activity-list">
            {recentPayments.map((payment) => (
              <div className="activity-item" key={payment.id}>
                <div>
                  <strong>{payment.customerName}</strong>
                  <span>{payment.invoiceNumber} · {payment.method}</span>
                </div>
                <div className="activity-amount">
                  <strong>{formatCurrency(payment.amount)}</strong>
                  <span className={`pill ${payment.status.toLowerCase()}`}>{payment.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <LowStockList items={lowStockItems.slice(0, 3)} title="Fast Focus" description="Keep an eye on the products that need attention first." />
      </section>
    </main>
  );
}
