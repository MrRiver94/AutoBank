import type { DashboardAnalytics } from '../model/analytics'

type KpiGridProps = {
  analytics: DashboardAnalytics
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-ES')

export function KpiGrid({ analytics }: KpiGridProps) {
  const kpis = [
    {
      label: 'Meses analizados',
      value: numberFormatter.format(analytics.statementCount),
      tone: 'default',
    },
    {
      label: 'Ingresos acumulados',
      value: currencyFormatter.format(analytics.totalIncome),
      tone: 'positive',
    },
    {
      label: 'Gastos acumulados',
      value: currencyFormatter.format(analytics.totalExpense),
      tone: 'negative',
    },
    {
      label: 'Balance neto',
      value: currencyFormatter.format(analytics.netTotal),
      tone: analytics.netTotal >= 0 ? 'positive' : 'negative',
    },
    {
      label: 'Media mensual de ingresos',
      value: currencyFormatter.format(analytics.averageMonthlyIncome),
      tone: 'default',
    },
    {
      label: 'Media mensual de gastos',
      value: currencyFormatter.format(analytics.averageMonthlyExpense),
      tone: 'default',
    },
    {
      label: 'Movimientos analizados',
      value: numberFormatter.format(analytics.movementCount),
      tone: 'default',
    },
    {
      label: 'Tasa de ahorro',
      value: `${analytics.savingsRate.toFixed(1)}%`,
      tone: analytics.savingsRate >= 0 ? 'positive' : 'negative',
    },
  ]

  return (
    <section className="kpi-grid">
      {kpis.map((kpi) => (
        <article
          className={`kpi-card ${kpi.tone !== 'default' ? `kpi-card--${kpi.tone}` : ''}`}
          key={kpi.label}
        >
          <span>{kpi.label}</span>
          <strong>{kpi.value}</strong>
        </article>
      ))}
    </section>
  )
}
