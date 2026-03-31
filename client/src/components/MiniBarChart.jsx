export default function MiniBarChart({ title, description, items, formatter = (value) => value }) {
  return (
    <div className="card chart-card">
      <div className="section-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="chart-stack">
        {items.map((item) => (
          <div className="chart-row" key={item.label}>
            <div className="chart-meta">
              <span>{item.label}</span>
              <strong>{formatter(item.value)}</strong>
            </div>
            <div className="chart-track">
              <span
                className={`chart-fill ${item.tone || ""}`.trim()}
                style={{ width: `${item.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
