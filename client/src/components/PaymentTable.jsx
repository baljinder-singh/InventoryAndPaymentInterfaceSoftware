function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default function PaymentTable({ payments }) {
  return (
    <div className="table-shell card data-card">
      <div className="section-heading section-heading-inline">
        <div>
          <p className="eyebrow">Collections</p>
          <h2>Payments</h2>
        </div>
        <p>Monitor invoice collection and payment status.</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>
                <div className="table-title-cell">
                  <strong>{payment.invoiceNumber}</strong>
                  <span>{payment.id}</span>
                </div>
              </td>
              <td>{payment.customerName}</td>
              <td>{formatCurrency(payment.amount)}</td>
              <td>{payment.method}</td>
              <td>
                <span className={`pill ${payment.status.toLowerCase()}`}>
                  {payment.status}
                </span>
              </td>
              <td>{payment.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
