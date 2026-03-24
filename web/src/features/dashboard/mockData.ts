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
