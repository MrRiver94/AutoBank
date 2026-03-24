import type { User } from '../../types/auth'
import type { PeriodSummary } from '../../types/statements'

export const mockCurrentUser: User = {
  id: 'user-admin-01',
  name: 'Daniel',
  email: 'danielriosproduccion@gmail.com',
  role: 'admin',
  permissions: ['SUPER_GRANT', 'UPLOAD_STATEMENTS', 'VIEW_ANALYTICS'],
  isActive: true,
}

export const mockPeriodSummary: PeriodSummary = {
  incomeTotal: 3250,
  expenseTotal: 2185.45,
  netTotal: 1064.55,
  movementCount: 24,
  periodMonth: 3,
  periodYear: 2026,
}

export const dashboardHighlights: string[] = [
  'Subir un extracto bancario',
  'Parsear y normalizar sus movimientos',
  'Visualizar datos del periodo',
  'Preparar el terreno para graficas y comparativas',
]

export const learningTopics: string[] = [
  'Modela usuarios, permisos, extractos y movimientos con precision',
  'Reduce errores al evolucionar la app',
  'Hace mas seguras las refactorizaciones',
  'Convierte los contratos del dominio en parte del codigo',
]
