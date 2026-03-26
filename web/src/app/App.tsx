import { useState } from 'react'
import './App.css'
import {
  dashboardHighlights,
  demoAccounts,
  learningTopics,
  mockMovements,
  mockPeriodSummary,
  mockStatement,
} from '../features/dashboard/mockData'
import { LoginPanel } from '../features/auth/components/LoginPanel'
import { SessionBanner } from '../features/auth/components/SessionBanner'
import { FeatureListCard } from '../features/dashboard/components/FeatureListCard'
import { MovementList } from '../features/dashboard/components/MovementList'
import { StatusOverview } from '../features/dashboard/components/StatusOverview'
import { SummaryMetrics } from '../features/dashboard/components/SummaryMetrics'
import type { User } from '../types/auth'

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

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
    return true
  }

  function handleLogout() {
    setCurrentUser(null)
  }

  return (
    <main className="app-shell">
      {currentUser ? (
        <>
          <SessionBanner currentUser={currentUser} onLogout={handleLogout} />

          <section className="hero-panel">
            <p className="eyebrow">AutoBank</p>
            <h1>Analiza extractos bancarios con una base clara y escalable.</h1>
            <p className="hero-copy">
              Esta primera version del proyecto nos servira para validar el flujo de
              subida, lectura y visualizacion de extractos mensuales antes de pasar
              a analitica mas avanzada.
            </p>

            <StatusOverview
              currentUser={currentUser}
              periodSummary={mockPeriodSummary}
            />
          </section>

          <section className="content-grid content-grid--analytics">
            <SummaryMetrics statement={mockStatement} summary={mockPeriodSummary} />
            <FeatureListCard title="Flujo inicial" items={dashboardHighlights} />
            <MovementList movements={mockMovements} />
            <FeatureListCard
              title="Por que TypeScript aqui"
              items={learningTopics}
            />
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
    </main>
  )
}
