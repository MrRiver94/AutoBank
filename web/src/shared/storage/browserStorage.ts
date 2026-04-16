export type LocalStorageKey = 'autobank.ui.active-view' | 'autobank.ui.theme'
export type SessionStorageKey = 'autobank.session.user-id'

const allowedLocalStorageKeys: ReadonlySet<LocalStorageKey> = new Set([
  'autobank.ui.active-view',
  'autobank.ui.theme',
])

const allowedSessionStorageKeys: ReadonlySet<SessionStorageKey> = new Set([
  'autobank.session.user-id',
])

function getBrowserStorage(scope: 'local' | 'session') {
  if (typeof window === 'undefined') {
    return null
  }

  return scope === 'local' ? window.localStorage : window.sessionStorage
}

function readStorage(scope: 'local' | 'session', key: string) {
  const storage = getBrowserStorage(scope)

  if (!storage) {
    return null
  }

  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(scope: 'local' | 'session', key: string, value: string) {
  const storage = getBrowserStorage(scope)

  if (!storage) {
    return
  }

  try {
    storage.setItem(key, value)
  } catch {
    // Ignore blocked browser storage writes.
  }
}

function removeStorage(scope: 'local' | 'session', key: string) {
  const storage = getBrowserStorage(scope)

  if (!storage) {
    return
  }

  try {
    storage.removeItem(key)
  } catch {
    // Ignore blocked browser storage removals.
  }
}

export function readLocalStorage(key: LocalStorageKey) {
  if (!allowedLocalStorageKeys.has(key)) {
    return null
  }

  return readStorage('local', key)
}

export function writeLocalStorage(key: LocalStorageKey, value: string) {
  if (!allowedLocalStorageKeys.has(key)) {
    return
  }

  writeStorage('local', key, value)
}

export function removeLocalStorage(key: LocalStorageKey) {
  if (!allowedLocalStorageKeys.has(key)) {
    return
  }

  removeStorage('local', key)
}

export function readSessionStorage(key: SessionStorageKey) {
  if (!allowedSessionStorageKeys.has(key)) {
    return null
  }

  return readStorage('session', key)
}

export function writeSessionStorage(key: SessionStorageKey, value: string) {
  if (!allowedSessionStorageKeys.has(key)) {
    return
  }

  writeStorage('session', key, value)
}

export function removeSessionStorage(key: SessionStorageKey) {
  if (!allowedSessionStorageKeys.has(key)) {
    return
  }

  removeStorage('session', key)
}
