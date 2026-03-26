import type { User } from '../../../types/auth'

type SessionBannerProps = {
  currentUser: User
  onLogout: () => void
}

export function SessionBanner({ currentUser, onLogout }: SessionBannerProps) {
  const isAdmin = currentUser.role === 'admin'

  return (
    <div className="session-banner">
      <div>
        <p className="session-banner__label">
          {isAdmin ? 'Administrator session' : 'User session'}
        </p>
        <h2>{currentUser.name}</h2>
        <p className="session-banner__meta">
          @{currentUser.username} · {currentUser.email}
        </p>
      </div>

      <div className="session-banner__actions">
        <span className={isAdmin ? 'role-pill role-pill--admin' : 'role-pill'}>
          {isAdmin ? 'ADMINISTRADOR' : 'USUARIO'}
        </span>
        <button className="logout-button" onClick={onLogout} type="button">
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
