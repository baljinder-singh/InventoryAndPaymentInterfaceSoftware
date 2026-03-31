import LowStockList from "../components/LowStockList";
import MiniBarChart from "../components/MiniBarChart";

export default function WorkspacePage({
  products,
  lowStockItems,
  recentPayments,
  formatCurrency
}) {
  const workspaceItems = [
    {
      label: "Restock queue",
      value: lowStockItems.length,
      width: lowStockItems.length ? Math.min(lowStockItems.length * 20, 100) : 12,
      tone: "tone-rose"
    },
    {
      label: "Recent payment entries",
      value: recentPayments.length,
      width: recentPayments.length ? Math.min(recentPayments.length * 25, 100) : 12,
      tone: "tone-teal"
    },
    {
      label: "Catalog focus items",
      value: products.slice(0, 3).length,
      width: 72,
      tone: "tone-blue"
    }
  ];

  return (
    <main className="page-shell">
      <section className="page-topbar compact-gap">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Quick actions and team focus</h2>
        </div>
      </section>

      <section className="dashboard-grid triple-grid">
        <div className="card activity-card">
          <div className="section-heading">
            <h2>Recent collections</h2>
            <p>The latest recorded inflow across your customers.</p>
          </div>
          <div className="activity-list">
            {recentPayments.map((payment) => (
              <div className="activity-item" key={payment.id}>
                <div>
                  <strong>{payment.customerName}</strong>
                  <span>{payment.invoiceNumber}</span>
                </div>
                <div className="activity-amount">
                  <strong>{formatCurrency(payment.amount)}</strong>
                  <span className={`pill ${payment.status.toLowerCase()}`}>{payment.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <LowStockList items={lowStockItems.length ? lowStockItems : products.slice(0, 3)} title="Team focus" description="A dedicated page for quick daily review from the left panel." />

        <MiniBarChart title="Daily action mix" description="A simple workload split for the current operational focus." items={workspaceItems} />
      </section>
    </main>
  );
}
