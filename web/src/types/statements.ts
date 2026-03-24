export type StatementStatus = 'pending' | 'processed' | 'failed'

export type MovementType = 'income' | 'expense'

export type Statement = {
  id: string
  fileName: string
  uploadedBy: string
  uploadedAt: string
  periodMonth: number
  periodYear: number
  sourceBank: string
  status: StatementStatus
}

export type Movement = {
  id: string
  statementId: string
  date: string
  description: string
  amount: number
  balance: number
  type: MovementType
  category: string
}

export type PeriodSummary = {
  incomeTotal: number
  expenseTotal: number
  netTotal: number
  movementCount: number
  periodMonth: number
  periodYear: number
}
