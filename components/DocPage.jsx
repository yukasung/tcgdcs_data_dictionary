export default function DocPage({ children, eyebrow, title, intro }) {
  return <section className="doc-page"><div className="eyebrow">{eyebrow || 'DATABASE REFERENCE'}</div><h1>{title}</h1>{intro && <p className="lead">{intro}</p>}{children}</section>
}
