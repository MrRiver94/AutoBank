type ChartCardFallbackProps = {
  eyebrow: string
  title: string
}

export function ChartCardFallback({
  eyebrow,
  title,
}: ChartCardFallbackProps) {
  return (
    <article className="content-card chart-card chart-loading-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <span className="section-counter">Cargando</span>
      </div>
      <p className="chart-description">
        Preparando la visualizacion para no cargar peso innecesario al arranque.
      </p>
      <div className="chart-stage chart-stage--loading" aria-hidden="true">
        <div className="chart-skeleton chart-skeleton--wide" />
        <div className="chart-skeleton-row">
          <div className="chart-skeleton" />
          <div className="chart-skeleton" />
          <div className="chart-skeleton" />
        </div>
      </div>
    </article>
  )
}
