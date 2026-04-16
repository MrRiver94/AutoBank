import {
  readSessionStorage,
  removeSessionStorage,
  writeSessionStorage,
} from '../../../shared/storage/browserStorage'

const SESSION_USER_STORAGE_KEY = 'autobank.session.user-id'
const LEGACY_SESSION_USER_STORAGE_KEY = 'autobank.session-user-id'

function getWindowObject() {
  if (typeof window === 'undefined') {
    return null
  }

  return window
}

export function getStoredSessionUserId() {
  const currentUserId = readSessionStorage(SESSION_USER_STORAGE_KEY)

  if (currentUserId) {
    return currentUserId
  }

  const windowObject = getWindowObject()

  if (!windowObject) {
    return null
  }

  const legacyUserId = windowObject.localStorage.getItem(LEGACY_SESSION_USER_STORAGE_KEY)

  if (!legacyUserId) {
    return null
  }

  writeSessionStorage(SESSION_USER_STORAGE_KEY, legacyUserId)
  windowObject.localStorage.removeItem(LEGACY_SESSION_USER_STORAGE_KEY)

  return legacyUserId
}

export function persistSessionUserId(userId: string) {
  writeSessionStorage(SESSION_USER_STORAGE_KEY, userId)

  const windowObject = getWindowObject()

  if (!windowObject) {
    return
  }

  windowObject.localStorage.removeItem(LEGACY_SESSION_USER_STORAGE_KEY)
}

export function clearStoredSessionUserId() {
  removeSessionStorage(SESSION_USER_STORAGE_KEY)

  const windowObject = getWindowObject()

  if (!windowObject) {
    return
  }

  windowObject.localStorage.removeItem(LEGACY_SESSION_USER_STORAGE_KEY)
}
