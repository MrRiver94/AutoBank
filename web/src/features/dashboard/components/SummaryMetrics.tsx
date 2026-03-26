import type { PeriodSummary, Statement } from '../../../types/statements'

type SummaryMetricsProps = {
  statement: Statement
  summary: PeriodSummary
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function SummaryMetrics({ statement, summary }: SummaryMetricsProps) {
  return (
    <article className="content-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Extracto actual</p>
          <h2>{statement.fileName}</h2>
        </div>
        <span className="section-counter">{statement.status}</span>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span>Ingresos</span>
          <strong>{currencyFormatter.format(summary.incomeTotal)}</strong>
        </div>
        <div className="metric-card">
          <span>Gastos</span>
          <strong>{currencyFormatter.format(summary.expenseTotal)}</strong>
        </div>
        <div className="metric-card">
          <span>Neto</span>
          <strong>{currencyFormatter.format(summary.netTotal)}</strong>
        </div>
      </div>

      <dl className="statement-meta">
        <div>
          <dt>Banco</dt>
          <dd>{statement.sourceBank}</dd>
        </div>
        <div>
          <dt>Periodo</dt>
          <dd>
            {statement.periodMonth}/{statement.periodYear}
          </dd>
        </div>
        <div>
          <dt>Subido por</dt>
          <dd>{statement.uploadedBy}</dd>
        </div>
      </dl>
    </article>
  )
}
