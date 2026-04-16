import type {
  Movement,
  ParsedStatementData,
  PeriodSummary,
  Statement,
} from '../../../types/statements'

export type MonthlyAnalyticsPoint = {
  key: string
  label: string
  incomeTotal: number
  expenseTotal: number
  netTotal: number
  movementCount: number
}

export type CategoryExpensePoint = {
  category: string
  total: number
}

export type DashboardAnalytics = {
  latestStatement: Statement
  latestSummary: PeriodSummary
  statementCount: number
  movementCount: number
  totalIncome: number
  totalExpense: number
  netTotal: number
  averageMonthlyIncome: number
  averageMonthlyExpense: number
  savingsRate: number
  monthlyPoints: MonthlyAnalyticsPoint[]
  topExpenseCategories: CategoryExpensePoint[]
  recentMovements: Movement[]
}

export function buildStatementScopeKey(periodYear: number, periodMonth: number) {
  return `${periodYear}-${String(periodMonth).padStart(2, '0')}`
}

function buildMonthLabel(periodYear: number, periodMonth: number) {
  return `${String(periodMonth).padStart(2, '0')}/${periodYear}`
}

export function buildDashboardAnalytics(
  statementsData: ParsedStatementData[],
): DashboardAnalytics {
  const sortedStatements = [...statementsData].sort((left, right) => {
    const leftKey = buildStatementScopeKey(
      left.statement.periodYear,
      left.statement.periodMonth,
    )
    const rightKey = buildStatementScopeKey(
      right.statement.periodYear,
      right.statement.periodMonth,
    )

    return leftKey.localeCompare(rightKey)
  })

  const latestStatementData = sortedStatements[sortedStatements.length - 1]
  const movementCount = sortedStatements.reduce(
    (total, statementData) => total + statementData.movements.length,
    0,
  )
  const totalIncome = sortedStatements.reduce(
    (total, statementData) => total + statementData.summary.incomeTotal,
    0,
  )
  const totalExpense = sortedStatements.reduce(
    (total, statementData) => total + statementData.summary.expenseTotal,
    0,
  )
  const netTotal = totalIncome - totalExpense
  const statementCount = sortedStatements.length

  const categoryTotals = new Map<string, number>()

  sortedStatements.forEach((statementData) => {
    statementData.movements.forEach((movement) => {
      if (movement.amount < 0) {
        const currentTotal = categoryTotals.get(movement.category) ?? 0
        categoryTotals.set(movement.category, currentTotal + Math.abs(movement.amount))
      }
    })
  })

  const topExpenseCategories = [...categoryTotals.entries()]
    .map(([category, total]) => ({
      category,
      total,
    }))
    .sort((left, right) => right.total - left.total)
    .slice(0, 6)

  const recentMovements = sortedStatements
    .flatMap((statementData) => statementData.movements)
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 12)

  return {
    latestStatement: latestStatementData.statement,
    latestSummary: latestStatementData.summary,
    statementCount,
    movementCount,
    totalIncome,
    totalExpense,
    netTotal,
    averageMonthlyIncome: totalIncome / statementCount,
    averageMonthlyExpense: totalExpense / statementCount,
    savingsRate: totalIncome > 0 ? (netTotal / totalIncome) * 100 : 0,
    monthlyPoints: sortedStatements.map((statementData) => ({
      key: buildStatementScopeKey(
        statementData.statement.periodYear,
        statementData.statement.periodMonth,
      ),
      label: buildMonthLabel(
        statementData.statement.periodYear,
        statementData.statement.periodMonth,
      ),
      incomeTotal: statementData.summary.incomeTotal,
      expenseTotal: statementData.summary.expenseTotal,
      netTotal: statementData.summary.netTotal,
      movementCount: statementData.summary.movementCount,
    })),
    topExpenseCategories,
    recentMovements,
  }
}
