import PaymentTable from "../components/PaymentTable";
import SummaryCard from "../components/SummaryCard";

export default function PaymentsPage({
  payments,
  paymentForm,
  setPaymentForm,
  handlePaymentSubmit,
  completedPayments,
  pendingPayments,
  collectionRate,
  formatCurrency
}) {
  return (
    <main className="page-shell">
      <section className="page-topbar compact-gap">
        <div>
          <p className="eyebrow">Payments</p>
          <h2>Collections and invoice flow</h2>
        </div>
      </section>

      <section className="summary-grid payments-summary-grid">
        <SummaryCard
          title="Completed"
          value={completedPayments.length}
          helper="Settled payment records"
          accent="accent-green"
        />
        <SummaryCard
          title="Pending"
          value={pendingPayments.length}
          helper="Awaiting confirmation"
          accent="accent-rose"
        />
        <SummaryCard
          title="Collection Rate"
          value={`${collectionRate}%`}
          helper="Completed versus total"
          accent="accent-blue"
        />
        <SummaryCard
          title="Total Records"
          value={payments.length}
          helper="Tracked transactions"
          accent="accent-gold"
        />
      </section>

      <section className="workspace-grid">
        <div className="card form-card">
          <div className="section-heading section-heading-inline">
            <div>
              <p className="eyebrow">Collections</p>
              <h2>Add Payment</h2>
            </div>
            <p>Record invoice collection and monitor settlement status.</p>
          </div>
          <form className="form-grid" onSubmit={handlePaymentSubmit}>
            <input
              placeholder="Invoice number"
              value={paymentForm.invoiceNumber}
              onChange={(event) => setPaymentForm({ ...paymentForm, invoiceNumber: event.target.value })}
              required
            />
            <input
              placeholder="Customer name"
              value={paymentForm.customerName}
              onChange={(event) => setPaymentForm({ ...paymentForm, customerName: event.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Amount"
              value={paymentForm.amount}
              onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })}
              required
            />
            <select
              value={paymentForm.method}
              onChange={(event) => setPaymentForm({ ...paymentForm, method: event.target.value })}
            >
              <option>UPI</option>
              <option>Card</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
            </select>
            <select
              value={paymentForm.status}
              onChange={(event) => setPaymentForm({ ...paymentForm, status: event.target.value })}
            >
              <option>Pending</option>
              <option>Completed</option>
              <option>Failed</option>
            </select>
            <input
              type="date"
              value={paymentForm.date}
              onChange={(event) => setPaymentForm({ ...paymentForm, date: event.target.value })}
            />
            <button className="primary-button" type="submit">Save Payment</button>
          </form>
        </div>

        <div className="card insight-card payment-insight-card">
          <div className="section-heading">
            <h2>Revenue Focus</h2>
            <p>Use this page when you want the collections workflow separated from inventory work.</p>
          </div>
          <div className="pulse-grid">
            {payments.slice(0, 3).map((payment) => (
              <div className="pulse-stat wide" key={payment.id}>
                <span>{payment.customerName}</span>
                <strong>{formatCurrency(payment.amount)}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PaymentTable payments={payments} />
    </main>
  );
}
