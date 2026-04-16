type SectionCardFallbackProps = {
  eyebrow: string
  title: string
}

export function SectionCardFallback({
  eyebrow,
  title,
}: SectionCardFallbackProps) {
  return (
    <section className="content-card section-loading-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <span className="section-counter">Cargando</span>
      </div>
      <p className="chart-description">
        Estamos trayendo esta seccion solo cuando la necesitas para mantener el
        arranque mas agil.
      </p>
      <div className="chart-stage chart-stage--loading" aria-hidden="true">
        <div className="chart-skeleton chart-skeleton--wide" />
        <div className="chart-skeleton-row">
          <div className="chart-skeleton" />
          <div className="chart-skeleton" />
        </div>
      </div>
    </section>
  )
}
