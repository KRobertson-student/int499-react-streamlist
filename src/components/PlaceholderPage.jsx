function PlaceholderPage({ eyebrow, title, description }) {
  return (
    <section className="placeholder-page">
      <div className="panel placeholder-panel">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="page-title">{title}</h2>
        <p className="page-copy">{description}</p>
      </div>
    </section>
  );
}

export default PlaceholderPage;
