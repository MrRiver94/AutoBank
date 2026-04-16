import { demoAccounts } from '../../features/auth/data/demoAccounts'
import { getStoredSessionUserId } from '../../features/auth/utils/authSession'
import { buildStatementScopeKey } from '../../features/dashboard/model/analytics'
import { readLocalStorage } from '../../shared/storage/browserStorage'
import type { User } from '../../types/auth'
import type { ParsedStatementData } from '../../types/statements'
import type { AppView } from '../components/AppNavigation'

export const ALL_SCOPE_KEY = 'all'
export const ACTIVE_VIEW_STORAGE_KEY = 'autobank.ui.active-view'
export const allowedAppViews: AppView[] = [
  'dashboard',
  'statement-upload',
  'support-users',
]

export function getStoredSessionUser() {
  const storedUserId = getStoredSessionUserId()

  if (!storedUserId) {
    return null
  }

  const matchingAccount = demoAccounts.find(
    (account) => account.user.id === storedUserId,
  )

  return matchingAccount?.user ?? null
}

export function getStoredAppView(): AppView {
  const storedView = readLocalStorage(ACTIVE_VIEW_STORAGE_KEY)

  if (storedView && allowedAppViews.includes(storedView as AppView)) {
    return storedView as AppView
  }

  return 'dashboard'
}

export function buildDashboardScopeOptions(
  statementsData: ParsedStatementData[],
) {
  return statementsData
    .map((statementData) => ({
      key: buildStatementScopeKey(
        statementData.statement.periodYear,
        statementData.statement.periodMonth,
      ),
      label: `${String(statementData.statement.periodMonth).padStart(2, '0')}/${statementData.statement.periodYear}`,
    }))
    .sort((left, right) => right.key.localeCompare(left.key))
}

export function filterStatementsByScope(
  statementsData: ParsedStatementData[],
  selectedScopeKey: string,
) {
  if (selectedScopeKey === ALL_SCOPE_KEY) {
    return statementsData
  }

  return statementsData.filter(
    (statementData) =>
      buildStatementScopeKey(
        statementData.statement.periodYear,
        statementData.statement.periodMonth,
      ) === selectedScopeKey,
  )
}

export function mergeParsedStatements(
  currentStatements: ParsedStatementData[],
  newStatementsData: ParsedStatementData[],
) {
  const statementsById = new Map(
    currentStatements.map((statementData) => [statementData.statement.id, statementData]),
  )

  newStatementsData.forEach((statementData) => {
    statementsById.set(statementData.statement.id, statementData)
  })

  return [...statementsById.values()].sort((left, right) => {
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
}

export function isCurrentUserDanielRios(user: User | null) {
  return user?.username.toLowerCase() === 'daniel_rios'
}
