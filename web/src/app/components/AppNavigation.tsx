import type { User } from '../../types/auth'

export type AppView = 'dashboard' | 'statement-upload' | 'support-users'

type AppNavigationProps = {
  activeView: AppView
  currentUser: User
  onSelectView: (view: AppView) => void
}

export function AppNavigation({
  activeView,
  currentUser,
  onSelectView,
}: AppNavigationProps) {
  const canUploadStatements = currentUser.permissions.includes('UPLOAD_STATEMENTS')
  const canViewSupportUsers = currentUser.permissions.includes('VIEW_SUPPORT_USERS')

  return (
    <aside className="app-navigation">
      <div className="app-navigation__section">
        <p className="eyebrow">Menu</p>
        <button
          className={
            activeView === 'dashboard'
              ? 'nav-link nav-link--active'
              : 'nav-link'
          }
          onClick={() => onSelectView('dashboard')}
          type="button"
        >
          Dashboard
        </button>
      </div>

      {canUploadStatements ? (
        <div className="app-navigation__section">
          <p className="app-navigation__group-label">Extractos</p>
          <button
            className={
              activeView === 'statement-upload'
                ? 'nav-link nav-link--active'
                : 'nav-link'
            }
            onClick={() => onSelectView('statement-upload')}
            type="button"
          >
            Subir archivo
          </button>
          <p className="app-navigation__hint">
            Carga y parsea un CSV para construir el dashboard del periodo.
          </p>
        </div>
      ) : null}

      {canViewSupportUsers ? (
        <div className="app-navigation__section">
          <p className="app-navigation__group-label">Soporte</p>
          <button
            className={
              activeView === 'support-users'
                ? 'nav-link nav-link--active'
                : 'nav-link'
            }
            onClick={() => onSelectView('support-users')}
            type="button"
          >
            Buscar usuario
          </button>
          <p className="app-navigation__hint">
            Visible solo para administradores con permisos de soporte.
          </p>
        </div>
      ) : null}
    </aside>
  )
}
