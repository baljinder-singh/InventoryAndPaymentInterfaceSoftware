export default function LowStockList({ items, title = "Low Stock Alerts", description = "Restock these items soon to avoid order delays." }) {
  return (
    <div className="card insight-card">
      <div className="section-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="alert-list">
        {items.length === 0 ? (
          <p className="empty-state">Everything is safely above the reorder level.</p>
        ) : (
          items.map((item) => (
            <div className="alert-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span className="alert-meta">{item.category} · {item.sku}</span>
              </div>
              <span>
                {item.stock} left, reorder at {item.reorderLevel}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
