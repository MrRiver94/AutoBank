import { useState } from 'react'
import type { User } from '../../../types/auth'

type SessionMenuProps = {
  currentUser: User
  onLogout: () => void
}

export function SessionMenu({ currentUser, onLogout }: SessionMenuProps) {
  const isAdmin = currentUser.role === 'admin'
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="session-menu">
      <button
        aria-expanded={isOpen}
        className={
          isOpen
            ? 'session-menu__trigger session-menu__trigger--open'
            : 'session-menu__trigger'
        }
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        type="button"
      >
        <div className="session-menu__identity">
          <span className="session-avatar" aria-hidden="true">
            {currentUser.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="session-menu__label">
              {isAdmin ? 'Administrador' : 'Usuario'}
            </p>
            <strong>{currentUser.name}</strong>
          </div>
        </div>
        <span className="session-menu__caret" aria-hidden="true">
          {isOpen ? '▴' : '▾'}
        </span>
      </button>

      {isOpen ? (
        <div className="session-menu__panel">
          <p className="session-menu__meta">@{currentUser.username}</p>
          <p className="session-menu__meta">{currentUser.email}</p>
          <div className="session-menu__row">
            <span className={isAdmin ? 'role-pill role-pill--admin' : 'role-pill'}>
              {isAdmin ? 'ADMIN' : 'USER'}
            </span>
            <button className="logout-button" onClick={onLogout} type="button">
              Cerrar sesion
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
