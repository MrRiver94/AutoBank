import { Suspense, lazy, useEffect, useState } from 'react'
import './App.css'
import { ChartCardFallback } from './components/ChartCardFallback'
import { AppNavigation, type AppView } from './components/AppNavigation'
import { SectionCardFallback } from './components/SectionCardFallback'
import {
  dashboardHighlights,
  learningTopics,
} from '../features/dashboard/data/dashboardContent'
import { demoAccounts } from '../features/auth/data/demoAccounts'
import {
  mockMovements,
  mockPeriodSummary,
  mockStatement,
} from '../features/dashboard/data/mockDashboardData'
import { LoginPanel } from '../features/auth/components/LoginPanel'
import { SessionMenu } from '../features/auth/components/SessionMenu'
import { DashboardScopeToolbar } from '../features/dashboard/components/DashboardScopeToolbar'
import { DashboardStatusOverview } from '../features/dashboard/components/DashboardStatusOverview'
import { FeatureListCard } from '../features/dashboard/components/FeatureListCard'
import { KpiGrid } from '../features/dashboard/components/KpiGrid'
import { MovementTableCard } from '../features/dashboard/components/MovementTableCard'
import { StatementSummaryCard } from '../features/dashboard/components/StatementSummaryCard'
import { UploadedStatementsCard } from '../features/dashboard/components/UploadedStatementsCard'
import {
  clearStoredSessionUserId,
  persistSessionUserId,
} from '../features/auth/utils/authSession'
import { buildDashboardAnalytics } from '../features/dashboard/model/analytics'
import { supportUserRecords } from '../features/support/data/supportUserRecords'
import { writeLocalStorage } from '../shared/storage/browserStorage'
import type { ParsedStatementData } from '../types/statements'
import type { User } from '../types/auth'
import {
  ACTIVE_VIEW_STORAGE_KEY,
  ALL_SCOPE_KEY,
  buildDashboardScopeOptions,
  filterStatementsByScope,
  getStoredAppView,
  getStoredSessionUser,
  isCurrentUserDanielRios,
  mergeParsedStatements,
} from './lib/dashboardState'
const MonthlyTrendChart = lazy(async () => {
  const module = await import('../features/dashboard/components/MonthlyTrendChart')
  return { default: module.MonthlyTrendChart }
})
const CategoryExpenseChart = lazy(async () => {
  const module = await import('../features/dashboard/components/CategoryExpenseChart')
  return { default: module.CategoryExpenseChart }
})
const StatementUploadSection = lazy(async () => {
  const module = await import('../features/statements/components/StatementUploadSection')
  return { default: module.StatementUploadSection }
})
const UserSupportSection = lazy(async () => {
  const module = await import('../features/support/components/UserSupportSection')
  return { default: module.UserSupportSection }
})

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getStoredSessionUser(),
  )
  const [activeView, setActiveView] = useState<AppView>(() => getStoredAppView())
  const [parsedStatementsData, setParsedStatementsData] = useState<ParsedStatementData[]>([])
  const [selectedDashboardScope, setSelectedDashboardScope] = useState(ALL_SCOPE_KEY)

  function handleLogin(username: string, password: string) {
    const matchingAccount = demoAccounts.find(
      (account) =>
        account.user.username.toLowerCase() === username.toLowerCase() &&
        account.password === password,
    )

    if (!matchingAccount) {
      return false
    }

    setCurrentUser(matchingAccount.user)
    setActiveView('dashboard')
    setSelectedDashboardScope(ALL_SCOPE_KEY)
    return true
  }

  function handleLogout() {
    setCurrentUser(null)
    setActiveView('dashboard')
    setParsedStatementsData([])
    setSelectedDashboardScope(ALL_SCOPE_KEY)
  }

  useEffect(() => {
    if (currentUser) {
      persistSessionUserId(currentUser.id)
      return
    }

    clearStoredSessionUserId()
  }, [currentUser])

  useEffect(() => {
    writeLocalStorage(ACTIVE_VIEW_STORAGE_KEY, activeView)
  }, [activeView])

  const canUploadStatements =
    currentUser?.permissions.includes('UPLOAD_STATEMENTS') ?? false
  const canViewSupportUsers =
    currentUser?.permissions.includes('VIEW_SUPPORT_USERS') ?? false
  const isDanielRiosUser = isCurrentUserDanielRios(currentUser)
  const shouldShowOnlyUploadedStatements = Boolean(isDanielRiosUser)
  const hasUploadedStatements = parsedStatementsData.length > 0
  const shouldUseMockDashboardData =
    !shouldShowOnlyUploadedStatements && !hasUploadedStatements
  const dashboardStatementsData = hasUploadedStatements
    ? parsedStatementsData
    : [
        {
          statement: mockStatement,
          summary: mockPeriodSummary,
          movements: mockMovements,
        },
      ]
  const dashboardScopeOptions = buildDashboardScopeOptions(dashboardStatementsData)
  const selectedStatementsData = filterStatementsByScope(
    dashboardStatementsData,
    selectedDashboardScope,
  )
  const effectiveStatementsData = selectedStatementsData.length
    ? selectedStatementsData
    : dashboardStatementsData
  const allDashboardAnalytics = buildDashboardAnalytics(dashboardStatementsData)
  const dashboardAnalytics = buildDashboardAnalytics(effectiveStatementsData)
  const isTotalScope = selectedDashboardScope === ALL_SCOPE_KEY
  const selectedScopeLabel = isTotalScope
    ? 'General'
    : dashboardScopeOptions.find((option) => option.key === selectedDashboardScope)?.label ??
      'Periodo'
  const dashboardItems = hasUploadedStatements && isTotalScope
    ? [
        'Analisis consolidado con varios meses cargados',
        'KPIs construidos a partir de todos los extractos activos',
        'Grafica mensual para comparar ingresos y gastos',
        'Desglose por categorias para detectar patrones de gasto',
      ]
    : hasUploadedStatements
      ? [
          'Vista mensual filtrada para revisar un periodo concreto',
          'KPIs y movimientos limitados al mes seleccionado',
          'Comparativa disponible desde el selector de alcance',
          'Puedes volver a Vista total en cualquier momento',
        ]
    : dashboardHighlights

  function handleStatementsParsed(newStatementsData: ParsedStatementData[]) {
    setParsedStatementsData((currentStatements) =>
      mergeParsedStatements(currentStatements, newStatementsData),
    )
    setSelectedDashboardScope(ALL_SCOPE_KEY)
  }

  useEffect(() => {
    if (
      selectedDashboardScope !== ALL_SCOPE_KEY &&
      !dashboardScopeOptions.some((option) => option.key === selectedDashboardScope)
    ) {
      setSelectedDashboardScope(ALL_SCOPE_KEY)
    }
  }, [dashboardScopeOptions, selectedDashboardScope])

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark">
          <div className="brand-mark__symbol" aria-hidden="true">
            <span>A</span>
          </div>
          <div className="brand-mark__copy">
            <p className="brand-mark__eyebrow">Financial Workspace</p>
            <h1>AutoBank</h1>
          </div>
        </div>

        {currentUser ? (
          <SessionMenu currentUser={currentUser} onLogout={handleLogout} />
        ) : (
          <div className="app-header__status">
            <span className="app-header__status-pill">Entorno local</span>
            <p>Gestion y analisis de extractos con acceso por usuario.</p>
          </div>
        )}
      </header>

      {currentUser ? (
        <>
          <section className="app-workspace">
            <AppNavigation
              activeView={activeView}
              currentUser={currentUser}
              onSelectView={setActiveView}
            />

            <div className="app-view">
              {activeView === 'statement-upload' && canUploadStatements ? (
                <>
                  <section className="hero-panel hero-panel--upload">
                    <p className="eyebrow">Extractos</p>
                    <h1>Sube, parsea y transforma un archivo en dashboard.</h1>
                    <p className="hero-copy">
                      Vamos a trabajar con una subida local sencilla en CSV. Una vez
                      parseado el archivo, la app podra leer sus movimientos y usar
                      ese contenido para construir el dashboard del periodo.
                    </p>
                  </section>

                  <Suspense
                    fallback={
                      <SectionCardFallback
                        eyebrow="Extractos / Subida"
                        title="Cargando flujo de subida"
                      />
                    }
                  >
                    <StatementUploadSection
                      currentUser={currentUser}
                      onOpenDashboard={() => setActiveView('dashboard')}
                      onStatementsParsed={handleStatementsParsed}
                      parsedStatementsData={parsedStatementsData}
                    />
                  </Suspense>
                </>
              ) : activeView === 'support-users' && canViewSupportUsers ? (
                <>
                  <section className="hero-panel hero-panel--support">
                    <p className="eyebrow">Soporte</p>
                    <h1>Centraliza la primera seccion de soporte para admins.</h1>
                    <p className="hero-copy">
                      Desde aqui el administrador puede entrar en Buscar usuario,
                      revisar el detalle del dashboard y preparar el siguiente paso:
                      una futura configuracion de roles y permisos mas completa.
                    </p>
                  </section>

                  <Suspense
                    fallback={
                      <SectionCardFallback
                        eyebrow="Support / Buscar usuario"
                        title="Cargando panel de soporte"
                      />
                    }
                  >
                    <UserSupportSection
                      currentUser={currentUser}
                      initialRecords={supportUserRecords}
                    />
                  </Suspense>
                </>
              ) : (
                <>
                  <section className="hero-panel">
                    <p className="eyebrow">AutoBank</p>
                    <h1>Analiza extractos bancarios con una base clara y escalable.</h1>
                    <p className="hero-copy">
                      Esta primera version del proyecto nos servira para validar el
                      flujo de subida, lectura y visualizacion de extractos mensuales
                      antes de pasar a analitica mas avanzada.
                    </p>

                    {hasUploadedStatements || shouldUseMockDashboardData ? (
                      <DashboardStatusOverview
                        currentUser={currentUser}
                        periodSummary={dashboardAnalytics.latestSummary}
                        periodLabelOverride={
                          dashboardAnalytics.statementCount > 1
                            ? `${dashboardAnalytics.statementCount} meses`
                            : `${dashboardAnalytics.latestSummary.periodMonth}/${dashboardAnalytics.latestSummary.periodYear}`
                        }
                        summaryDescription={
                          hasUploadedStatements
                            ? `${dashboardAnalytics.movementCount} movimientos leidos desde ${dashboardAnalytics.statementCount} archivo(s)`
                            : undefined
                        }
                      />
                    ) : (
                      <div className="empty-dashboard-banner">
                        <strong>Sin extractos cargados</strong>
                        <p>
                          Este usuario ya no muestra extractos hardcodeados. Cuando
                          subas un archivo desde la seccion `Subir archivo`, el
                          dashboard se construira con esos datos.
                        </p>
                      </div>
                    )}
                  </section>

                  {hasUploadedStatements || shouldUseMockDashboardData ? (
                    <section className="content-grid content-grid--analytics">
                      <DashboardScopeToolbar
                        monthlyPoints={allDashboardAnalytics.monthlyPoints}
                        onSelectScope={setSelectedDashboardScope}
                        selectedScopeKey={selectedDashboardScope}
                      />
                      <StatementSummaryCard
                        statement={dashboardAnalytics.latestStatement}
                        summary={dashboardAnalytics.latestSummary}
                        eyebrow={
                          isTotalScope && dashboardAnalytics.statementCount > 1
                            ? 'Ultimo extracto cargado'
                            : 'Extracto actual'
                        }
                        title={
                          isTotalScope && dashboardAnalytics.statementCount > 1
                            ? `${dashboardAnalytics.latestStatement.fileName} y ${dashboardAnalytics.statementCount - 1} mes(es) mas`
                            : dashboardAnalytics.latestStatement.fileName
                        }
                      />
                      <FeatureListCard title="Flujo inicial" items={dashboardItems} />
                      <KpiGrid analytics={dashboardAnalytics} />
                      <Suspense
                        fallback={
                          <ChartCardFallback
                            eyebrow="Tendencia mensual"
                            title="Cargando analitica temporal"
                          />
                        }
                      >
                        <MonthlyTrendChart
                          isTotalScope={isTotalScope}
                          points={allDashboardAnalytics.monthlyPoints}
                          scopeLabel={selectedScopeLabel}
                          selectedPointKey={selectedDashboardScope}
                        />
                      </Suspense>
                      <Suspense
                        fallback={
                          <ChartCardFallback
                            eyebrow="Categorias"
                            title="Cargando distribucion de gasto"
                          />
                        }
                      >
                        <CategoryExpenseChart
                          isTotalScope={isTotalScope}
                          points={dashboardAnalytics.topExpenseCategories}
                          scopeLabel={selectedScopeLabel}
                        />
                      </Suspense>
                      <UploadedStatementsCard
                        onSelectScope={setSelectedDashboardScope}
                        selectedScopeKey={selectedDashboardScope}
                        statements={dashboardStatementsData}
                      />
                      <MovementTableCard
                        movements={dashboardAnalytics.recentMovements}
                        eyebrow="Actividad reciente"
                        title="Movimientos mas recientes cargados"
                      />
                      <FeatureListCard
                        title="Por que TypeScript aqui"
                        items={learningTopics}
                      />
                    </section>
                  ) : (
                    <section className="content-grid">
                      <article className="content-card empty-dashboard-card">
                        <p className="eyebrow">Dashboard limpio</p>
                        <h2>Aun no hay datos para este usuario</h2>
                        <p>
                          Hemos retirado los extractos mock de `Daniel_Rios`. El
                          siguiente extracto que subas sera el unico que se mostrara
                          en el dashboard durante esta sesion.
                        </p>
                      </article>

                      <FeatureListCard
                        title="Siguiente paso"
                        items={[
                          'Entra en la seccion Subir archivo',
                          'Selecciona tu CSV',
                          'Parsea el extracto',
                          'Vuelve al dashboard para ver el resultado',
                        ]}
                      />
                    </section>
                  )}
                </>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="app-shell__auth">
          <section className="hero-panel hero-panel--compact">
            <p className="eyebrow">AutoBank</p>
            <h1>Controla el acceso y revisa tus extractos con contexto.</h1>
            <p className="hero-copy">
              Vamos a trabajar con un login local de pruebas para diferenciar el
              perfil administrador del usuario estándar y empezar a visualizar
              datos bancarios de ejemplo.
            </p>
          </section>

          <LoginPanel accounts={demoAccounts} onLogin={handleLogin} />
        </section>
      )}

      <footer className="app-footer">
        <p>Copyright © Daniel Rios</p>
      </footer>
    </main>
  )
}
