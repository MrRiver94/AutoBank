import type { User } from '../../../types/auth'
import { demoAccounts } from '../../auth/data/demoAccounts'
import type { SupportUserRecord } from '../model/supportUser'

const [adminAccount, standardAccount] = demoAccounts

const analystUser: User = {
  id: 'user-analyst-01',
  username: 'analyst_marta',
  name: 'Marta Salas',
  email: 'marta.salas@autobank.local',
  role: 'user',
  permissions: ['VIEW_STATEMENTS', 'VIEW_ANALYTICS'],
  isActive: true,
}

export const supportUserRecords: SupportUserRecord[] = [
  {
    id: 'support-user-admin-01',
    user: adminAccount.user,
    statement: {
      id: 'statement-support-admin-03-2026',
      fileName: 'extracto-admin-marzo-2026.csv',
      uploadedBy: adminAccount.user.name,
      uploadedAt: '2026-03-25T08:30:00',
      periodMonth: 3,
      periodYear: 2026,
      sourceBank: 'Banco Demo Pro',
      status: 'processed',
    },
    summary: {
      incomeTotal: 4200,
      expenseTotal: 2475.2,
      netTotal: 1724.8,
      movementCount: 31,
      periodMonth: 3,
      periodYear: 2026,
    },
    lastAccessAt: '2026-03-26T09:45:00',
    supportStatus: 'stable',
    notes: 'Cuenta base de administracion para revisar permisos y soporte interno.',
  },
  {
    id: 'support-user-standard-01',
    user: standardAccount.user,
    statement: {
      id: 'statement-support-user-03-2026',
      fileName: 'extracto-usuario-marzo-2026.csv',
      uploadedBy: standardAccount.user.name,
      uploadedAt: '2026-03-24T19:15:00',
      periodMonth: 3,
      periodYear: 2026,
      sourceBank: 'Banco Demo',
      status: 'processed',
    },
    summary: {
      incomeTotal: 2540,
      expenseTotal: 1985.35,
      netTotal: 554.65,
      movementCount: 22,
      periodMonth: 3,
      periodYear: 2026,
    },
    lastAccessAt: '2026-03-25T18:20:00',
    supportStatus: 'review',
    notes: 'Usuario de pruebas para revisar visibilidad del dashboard y extractos.',
  },
  {
    id: 'support-user-analyst-01',
    user: analystUser,
    statement: {
      id: 'statement-support-analyst-02-2026',
      fileName: 'extracto-marta-febrero-2026.csv',
      uploadedBy: analystUser.name,
      uploadedAt: '2026-03-01T10:05:00',
      periodMonth: 2,
      periodYear: 2026,
      sourceBank: 'Banco Norte',
      status: 'processed',
    },
    summary: {
      incomeTotal: 1980,
      expenseTotal: 1560.1,
      netTotal: 419.9,
      movementCount: 18,
      periodMonth: 2,
      periodYear: 2026,
    },
    lastAccessAt: '2026-03-22T12:10:00',
    supportStatus: 'attention',
    notes: 'Pendiente de seguimiento por acceso reciente a analitica avanzada.',
  },
]
