import type { Permission, User } from '../../../types/auth'
import type { PeriodSummary, Statement } from '../../../types/statements'

export type SupportUserStatus = 'stable' | 'review' | 'attention'

export type SupportUserRecord = {
  id: string
  user: User
  statement: Statement
  summary: PeriodSummary
  lastAccessAt: string
  supportStatus: SupportUserStatus
  notes: string
}

export const supportStatusLabels: Record<SupportUserStatus, string> = {
  stable: 'Operativo',
  review: 'En revision',
  attention: 'Seguimiento',
}

export function cloneSupportUserRecord(record: SupportUserRecord): SupportUserRecord {
  return {
    ...record,
    user: {
      ...record.user,
      permissions: [...record.user.permissions],
    },
    statement: {
      ...record.statement,
    },
    summary: {
      ...record.summary,
    },
  }
}

export function getSupportActionAccess(permissions: Permission[]) {
  return {
    canView: permissions.includes('VIEW_SUPPORT_USERS'),
    canCreate: permissions.includes('CREATE_SUPPORT_USERS'),
    canUpdate: permissions.includes('UPDATE_SUPPORT_USERS'),
    canDelete: permissions.includes('DELETE_SUPPORT_USERS'),
  }
}

export function getNextSupportStatus(
  status: SupportUserStatus,
): SupportUserStatus {
  if (status === 'stable') {
    return 'review'
  }

  if (status === 'review') {
    return 'attention'
  }

  return 'stable'
}

export function createSupportDraftRecord(
  index: number,
  seed: string,
): SupportUserRecord {
  const normalizedSeed = seed.trim().toLowerCase().replace(/\s+/g, '-')
  const suffix = normalizedSeed || `draft-${index}`
  const now = new Date().toISOString()

  return {
    id: `support-draft-${index}`,
    user: {
      id: `draft-user-${index}`,
      username: `draft_${suffix}`,
      name: `Usuario Soporte ${index}`,
      email: `draft${index}@autobank.local`,
      role: 'user',
      permissions: ['VIEW_STATEMENTS'],
      isActive: true,
    },
    statement: {
      id: `draft-statement-${index}`,
      fileName: `borrador-soporte-${index}.csv`,
      uploadedBy: 'Support Admin',
      uploadedAt: now,
      periodMonth: 3,
      periodYear: 2026,
      sourceBank: 'Banco Sandbox',
      status: 'pending',
    },
    summary: {
      incomeTotal: 0,
      expenseTotal: 0,
      netTotal: 0,
      movementCount: 0,
      periodMonth: 3,
      periodYear: 2026,
    },
    lastAccessAt: now,
    supportStatus: 'review',
    notes: 'Registro creado desde la seccion de soporte para futuras gestiones.',
  }
}
