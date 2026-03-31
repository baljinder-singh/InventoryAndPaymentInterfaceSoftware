function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default function ProductTable({ products }) {
  return (
    <div className="table-shell card">
      <div className="section-heading">
        <h2>Products</h2>
        <p>Track SKUs, pricing, and stock availability.</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Reorder Level</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.category}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.stock}</td>
              <td>{product.reorderLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
