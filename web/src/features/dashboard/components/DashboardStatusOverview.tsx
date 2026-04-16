import type { User } from '../../../types/auth'
import type { PeriodSummary } from '../../../types/statements'
import { StatusCard } from './StatusCard'

type DashboardStatusOverviewProps = {
  currentUser: User
  periodSummary: PeriodSummary
  periodLabelOverride?: string
  summaryDescription?: string
}

export function DashboardStatusOverview({
  currentUser,
  periodSummary,
  periodLabelOverride,
  summaryDescription,
}: DashboardStatusOverviewProps) {
  const primaryPermission = currentUser.permissions[0] ?? 'Sin permisos'
  const periodLabel =
    periodLabelOverride ?? `${periodSummary.periodMonth}/${periodSummary.periodYear}`
  const movementLabel =
    summaryDescription ?? `${periodSummary.movementCount} movimientos cargados en mock`

  return (
    <div className="status-grid">
      <StatusCard
        label="Usuario actual"
        value={currentUser.name}
        description={currentUser.role}
      />
      <StatusCard
        label="Permiso principal"
        value={primaryPermission}
        description="Modelo inicial de permisos del sistema"
      />
      <StatusCard
        label="Resumen del periodo"
        value={periodLabel}
        description={movementLabel}
      />
    </div>
  )
}
