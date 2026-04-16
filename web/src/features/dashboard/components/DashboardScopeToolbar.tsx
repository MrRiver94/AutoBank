import type { MonthlyAnalyticsPoint } from '../model/analytics'

type DashboardScopeToolbarProps = {
  monthlyPoints: MonthlyAnalyticsPoint[]
  selectedScopeKey: string
  onSelectScope: (scopeKey: string) => void
}

export function DashboardScopeToolbar({
  monthlyPoints,
  selectedScopeKey,
  onSelectScope,
}: DashboardScopeToolbarProps) {
  const orderedPoints = [...monthlyPoints].sort((left, right) =>
    right.key.localeCompare(left.key),
  )
  const groupedPoints = orderedPoints.reduce<Record<string, MonthlyAnalyticsPoint[]>>(
    (groups, point) => {
      const year = point.key.slice(0, 4)
      const currentGroup = groups[year] ?? []
      currentGroup.push(point)
      groups[year] = currentGroup
      return groups
    },
    {},
  )
  const selectedIndex = orderedPoints.findIndex((point) => point.key === selectedScopeKey)
  const previousPoint =
    selectedIndex >= 0 && selectedIndex < orderedPoints.length - 1
      ? orderedPoints[selectedIndex + 1]
      : null
  const nextPoint = selectedIndex > 0 ? orderedPoints[selectedIndex - 1] : null

  return (
    <section className="content-card dashboard-scope-toolbar">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Filtro de analisis</p>
          <h2>Selecciona el periodo que quieres estudiar</h2>
        </div>
        <span className="section-counter">{monthlyPoints.length} meses</span>
      </div>

      <div className="scope-toolbar">
        <button
          className={
            selectedScopeKey === 'all'
              ? 'scope-switcher__button scope-switcher__button--active'
              : 'scope-switcher__button'
          }
          onClick={() => onSelectScope('all')}
          type="button"
        >
          Vista total
        </button>

        <label className="scope-select-field">
          <span>Mes / ano</span>
          <select
            className="scope-select"
            onChange={(event) => onSelectScope(event.target.value)}
            value={selectedScopeKey}
          >
            <option value="all">General</option>
            {Object.entries(groupedPoints).map(([year, points]) => (
              <optgroup key={year} label={year}>
                {points.map((point) => (
                  <option key={point.key} value={point.key}>
                    {point.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <div className="scope-shortcuts">
          <button
            className="scope-nav-button"
            disabled={!nextPoint}
            onClick={() => nextPoint && onSelectScope(nextPoint.key)}
            type="button"
          >
            Mes siguiente
          </button>
          <button
            className="scope-nav-button"
            disabled={!previousPoint}
            onClick={() => previousPoint && onSelectScope(previousPoint.key)}
            type="button"
          >
            Mes anterior
          </button>
        </div>
      </div>

      <p className="scope-toolbar__summary">
        {selectedScopeKey === 'all'
          ? 'Estas viendo el analisis consolidado completo de todos los extractos cargados.'
          : `Estas viendo el analisis detallado del periodo ${orderedPoints.find((point) => point.key === selectedScopeKey)?.label}.`}
      </p>
    </section>
  )
}
