function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default function PaymentTable({ payments }) {
  return (
    <div className="table-shell card">
      <div className="section-heading">
        <h2>Payments</h2>
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
              <td>{payment.invoiceNumber}</td>
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
