function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default function ProductTable({ products }) {
  return (
    <div className="table-shell card data-card">
      <div className="section-heading section-heading-inline">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Products</h2>
        </div>
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
              <td>
                <div className="table-title-cell">
                  <strong>{product.name}</strong>
                  <span>{product.id}</span>
                </div>
              </td>
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
