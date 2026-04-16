import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyAnalyticsPoint } from '../model/analytics'

type MonthlyTrendChartProps = {
  points: MonthlyAnalyticsPoint[]
  selectedPointKey?: string
  scopeLabel: string
  isTotalScope: boolean
}

type ChartTooltipPayload = {
  color?: string
  dataKey?: string | number
  value?: number
  payload?: {
    label?: string
    detailLabel?: string
  }
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const compactCurrencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const chartPalette = {
  brand: '#b9313f',
  accent: '#ef8c94',
  ink: '#52202b',
  muted: '#8f6770',
  grid: 'rgba(52, 17, 26, 0.08)',
  cursor: 'rgba(185, 49, 63, 0.08)',
}

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: ChartTooltipPayload[]
  label?: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <div className="chart-tooltip__items">
        {payload.map((item) => (
          <div className="chart-tooltip__item" key={String(item.dataKey)}>
            <span
              className="chart-tooltip__dot"
              style={{ backgroundColor: item.color ?? 'currentColor' }}
            />
            <span>{item.payload?.detailLabel ?? item.dataKey}</span>
            <strong>
              {typeof item.value === 'number'
                ? currencyFormatter.format(item.value)
                : '--'}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MonthlyTrendChart({
  points,
  selectedPointKey = 'all',
  scopeLabel,
  isTotalScope,
}: MonthlyTrendChartProps) {
  const selectedPoint = points.find((point) => point.key === selectedPointKey) ?? points[0]

  const totalScopeData = points.map((point) => ({
    ...point,
    detailLabel: point.label,
  }))

  const focusedScopeData = selectedPoint
    ? [
        {
          id: 'income',
          label: 'Ingresos',
          value: selectedPoint.incomeTotal,
          fill: chartPalette.brand,
          detailLabel: `Ingresos ${selectedPoint.label}`,
        },
        {
          id: 'expense',
          label: 'Gastos',
          value: selectedPoint.expenseTotal,
          fill: chartPalette.accent,
          detailLabel: `Gastos ${selectedPoint.label}`,
        },
      ]
    : []

  return (
    <article className="content-card chart-card chart-card--monthly">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Tendencia mensual</p>
          <h2>
            {isTotalScope
              ? 'Ingresos y gastos por mes'
              : `Detalle de ingresos y gastos en ${scopeLabel}`}
          </h2>
        </div>
        <span className="section-counter">
          {isTotalScope ? `${points.length} meses` : scopeLabel}
        </span>
      </div>

      <p className="chart-description">
        {isTotalScope
          ? 'Comparativa mensual limpia para detectar balance, evolucion y cambios entre periodos.'
          : 'Vista enfocada en un unico mes con una lectura simple de ingresos frente a gastos.'}
      </p>

      <div className="chart-stage">
        {isTotalScope ? (
          <ResponsiveContainer height={360} width="100%">
            <ComposedChart
              data={totalScopeData}
              margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
            >
              <CartesianGrid stroke={chartPalette.grid} vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: chartPalette.muted, fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: chartPalette.muted, fontSize: 12 }}
                tickFormatter={(value: number) => compactCurrencyFormatter.format(value)}
                tickLine={false}
                width={84}
              />
              <Tooltip content={<TrendTooltip />} cursor={{ fill: chartPalette.cursor }} />
              <Legend
                formatter={(value) =>
                  value === 'incomeTotal'
                    ? 'Ingresos'
                    : value === 'expenseTotal'
                      ? 'Gastos'
                      : 'Balance neto'
                }
                wrapperStyle={{ paddingTop: 12 }}
              />
              <Bar
                barSize={18}
                dataKey="incomeTotal"
                fill={chartPalette.brand}
                name="incomeTotal"
                radius={[10, 10, 0, 0]}
              />
              <Bar
                barSize={18}
                dataKey="expenseTotal"
                fill={chartPalette.accent}
                name="expenseTotal"
                radius={[10, 10, 0, 0]}
              />
              <Line
                dataKey="netTotal"
                dot={{ fill: chartPalette.ink, r: 3 }}
                name="netTotal"
                stroke={chartPalette.ink}
                strokeWidth={2.5}
                type="monotone"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : focusedScopeData.length ? (
          <ResponsiveContainer height={280} width="100%">
            <BarChart
              data={focusedScopeData}
              layout="vertical"
              margin={{ top: 8, right: 24, bottom: 8, left: 16 }}
            >
              <CartesianGrid horizontal={false} stroke={chartPalette.grid} />
              <XAxis
                axisLine={false}
                tick={{ fill: chartPalette.muted, fontSize: 12 }}
                tickFormatter={(value: number) => compactCurrencyFormatter.format(value)}
                tickLine={false}
                type="number"
              />
              <YAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: chartPalette.ink, fontSize: 13, fontWeight: 700 }}
                tickLine={false}
                type="category"
                width={84}
              />
              <Tooltip content={<TrendTooltip />} cursor={{ fill: chartPalette.cursor }} />
              <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                {focusedScopeData.map((entry) => (
                  <Cell fill={entry.fill} key={entry.id} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty-state">
            <p>No hay informacion disponible para el periodo seleccionado.</p>
          </div>
        )}
      </div>

      {!isTotalScope && selectedPoint ? (
        <div className="chart-insight-grid">
          <div className="chart-insight-card">
            <span>Balance neto</span>
            <strong>{currencyFormatter.format(selectedPoint.netTotal)}</strong>
          </div>
          <div className="chart-insight-card">
            <span>Movimientos</span>
            <strong>{selectedPoint.movementCount}</strong>
          </div>
        </div>
      ) : null}
    </article>
  )
}
