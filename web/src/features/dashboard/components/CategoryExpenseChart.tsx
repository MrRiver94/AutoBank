import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CategoryExpensePoint } from '../model/analytics'

type CategoryExpenseChartProps = {
  points: CategoryExpensePoint[]
  scopeLabel: string
  isTotalScope: boolean
}

type CategoryTooltipPayload = {
  color?: string
  value?: number
  payload?: {
    category?: string
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

function CategoryTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: CategoryTooltipPayload[]
}) {
  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0]

  return (
    <div className="chart-tooltip">
      <strong>{point.payload?.category}</strong>
      <div className="chart-tooltip__items">
        <div className="chart-tooltip__item">
          <span
            className="chart-tooltip__dot"
            style={{ backgroundColor: point.color ?? chartPalette.brand }}
          />
          <span>Gasto acumulado</span>
          <strong>
            {typeof point.value === 'number'
              ? currencyFormatter.format(point.value)
              : '--'}
          </strong>
        </div>
      </div>
    </div>
  )
}

export function CategoryExpenseChart({
  points,
  scopeLabel,
  isTotalScope,
}: CategoryExpenseChartProps) {
  const chartData = points.map((point, index) => ({
    ...point,
    fill: index % 2 === 0 ? chartPalette.brand : chartPalette.accent,
  }))

  return (
    <article className="content-card chart-card chart-card--category">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Categorias</p>
          <h2>
            {isTotalScope
              ? 'Gasto acumulado por categoria'
              : `Gasto por categoria en ${scopeLabel}`}
          </h2>
        </div>
        <span className="section-counter">
          {isTotalScope ? `Top ${points.length}` : scopeLabel}
        </span>
      </div>

      <p className="chart-description">
        {isTotalScope
          ? 'Las categorias clave quedan resumidas en una sola vista para evitar ruido visual.'
          : 'Lectura enfocada del peso real de cada categoria dentro del periodo seleccionado.'}
      </p>

      {chartData.length ? (
        <div className="chart-stage chart-stage--category">
          <ResponsiveContainer height={320} width="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 24, bottom: 8, left: 12 }}
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
                dataKey="category"
                tick={{ fill: chartPalette.ink, fontSize: 12, fontWeight: 700 }}
                tickLine={false}
                type="category"
                width={110}
              />
              <Tooltip
                content={<CategoryTooltip />}
                cursor={{ fill: chartPalette.cursor }}
              />
              <Bar dataKey="total" radius={[0, 12, 12, 0]}>
                {chartData.map((entry) => (
                  <Cell fill={entry.fill} key={entry.category} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="chart-empty-state">
          <p>No hay gastos categorizados disponibles para este alcance.</p>
        </div>
      )}
    </article>
  )
}
