export default function SummaryCard({ title, value, helper }) {
  return (
    <article className="card summary-card">
      <p className="eyebrow">{title}</p>
      <h3>{value}</h3>
      <span>{helper}</span>
    </article>
  );
}
