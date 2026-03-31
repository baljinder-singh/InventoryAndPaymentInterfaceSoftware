export default function LowStockList({ items }) {
  return (
    <div className="card">
      <div className="section-heading">
        <h2>Low Stock Alerts</h2>
        <p>Restock these items soon to avoid order delays.</p>
      </div>
      <div className="alert-list">
        {items.length === 0 ? (
          <p className="empty-state">Everything is safely above the reorder level.</p>
        ) : (
          items.map((item) => (
            <div className="alert-item" key={item.id}>
              <strong>{item.name}</strong>
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
