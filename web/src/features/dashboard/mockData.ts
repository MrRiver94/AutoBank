import type { User } from '../../types/auth'
import type { Movement, PeriodSummary, Statement } from '../../types/statements'

export type DemoAccount = {
  user: User
  password: string
}

export const demoAccounts: DemoAccount[] = [
  {
    user: {
      id: 'user-admin-01',
      username: 'drios',
      name: 'Daniel Rios',
      email: 'danielriosproduccion@gmail.com',
      role: 'admin',
      permissions: ['SUPER_GRANT', 'UPLOAD_STATEMENTS', 'VIEW_ANALYTICS'],
      isActive: true,
    },
    password: 'Password123',
  },
  {
    user: {
      id: 'user-standard-01',
      username: 'Daniel_Rios',
      name: 'Daniel Rios Usuario',
      email: 'danielriosproduccion@gmail.com',
      role: 'user',
      permissions: ['UPLOAD_STATEMENTS', 'VIEW_STATEMENTS', 'VIEW_ANALYTICS'],
      isActive: true,
    },
    password: 'Password123',
  },
]

export const mockStatement: Statement = {
  id: 'statement-2026-03',
  fileName: 'extracto-marzo-2026.csv',
  uploadedBy: 'Daniel Rios',
  uploadedAt: '2026-03-24T20:15:00',
  periodMonth: 3,
  periodYear: 2026,
  sourceBank: 'Banco Demo',
  status: 'processed',
}

export const mockPeriodSummary: PeriodSummary = {
  incomeTotal: 3250,
  expenseTotal: 2185.45,
  netTotal: 1064.55,
  movementCount: 24,
  periodMonth: 3,
  periodYear: 2026,
}

export const mockMovements: Movement[] = [
  {
    id: 'mov-001',
    statementId: mockStatement.id,
    date: '2026-03-01',
    description: 'Nomina',
    amount: 2450,
    balance: 3420.15,
    type: 'income',
    category: 'Ingresos',
  },
  {
    id: 'mov-002',
    statementId: mockStatement.id,
    date: '2026-03-03',
    description: 'Alquiler vivienda',
    amount: -850,
    balance: 2570.15,
    type: 'expense',
    category: 'Vivienda',
  },
  {
    id: 'mov-003',
    statementId: mockStatement.id,
    date: '2026-03-07',
    description: 'Supermercado',
    amount: -126.45,
    balance: 2443.7,
    type: 'expense',
    category: 'Alimentacion',
  },
  {
    id: 'mov-004',
    statementId: mockStatement.id,
    date: '2026-03-12',
    description: 'Factura internet',
    amount: -48.99,
    balance: 2394.71,
    type: 'expense',
    category: 'Suministros',
  },
  {
    id: 'mov-005',
    statementId: mockStatement.id,
    date: '2026-03-18',
    description: 'Transferencia ahorro',
    amount: -300,
    balance: 2094.71,
    type: 'expense',
    category: 'Ahorro',
  },
]

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
