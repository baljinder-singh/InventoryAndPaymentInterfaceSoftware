export default function SummaryCard({ title, value, helper, accent }) {
  return (
    <article className={`card summary-card ${accent || ""}`.trim()}>
      <div className="summary-card-head">
        <p className="eyebrow">{title}</p>
        <span className="summary-badge">Live</span>
      </div>
      <h3>{value}</h3>
      <span>{helper}</span>
    </article>
  );
}
