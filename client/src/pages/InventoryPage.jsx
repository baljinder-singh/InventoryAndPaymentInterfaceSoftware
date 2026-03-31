import LowStockList from "../components/LowStockList";
import ProductTable from "../components/ProductTable";

export default function InventoryPage({
  products,
  lowStockItems,
  productForm,
  setProductForm,
  handleProductSubmit
}) {
  return (
    <main className="page-shell">
      <section className="page-topbar compact-gap">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Products and stock control</h2>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="card form-card">
          <div className="section-heading section-heading-inline">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2>Add Product</h2>
            </div>
            <p>Capture new items before they enter stock movement.</p>
          </div>
          <form className="form-grid" onSubmit={handleProductSubmit}>
            <input
              placeholder="Product name"
              value={productForm.name}
              onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
              required
            />
            <input
              placeholder="Category"
              value={productForm.category}
              onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
              required
            />
            <input
              placeholder="SKU"
              value={productForm.sku}
              onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Price"
              value={productForm.price}
              onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Stock"
              value={productForm.stock}
              onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Reorder level"
              value={productForm.reorderLevel}
              onChange={(event) => setProductForm({ ...productForm, reorderLevel: event.target.value })}
              required
            />
            <button className="primary-button" type="submit">Save Product</button>
          </form>
        </div>

        <LowStockList
          items={lowStockItems}
          title="Restock Queue"
          description="These products have reached or crossed their reorder threshold."
        />
      </section>

      <ProductTable products={products} />
    </main>
  );
}
