import './App.css'
import {
  dashboardHighlights,
  learningTopics,
  mockCurrentUser,
  mockPeriodSummary,
} from '../features/dashboard/mockData'
import { FeatureListCard } from '../features/dashboard/components/FeatureListCard'
import { StatusOverview } from '../features/dashboard/components/StatusOverview'

export function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">AutoBank</p>
        <h1>Analiza extractos bancarios con una base clara y escalable.</h1>
        <p className="hero-copy">
          Esta primera version del proyecto nos servira para validar el flujo de
          subida, lectura y visualizacion de extractos mensuales antes de pasar
          a analitica mas avanzada.
        </p>

        <StatusOverview
          currentUser={mockCurrentUser}
          periodSummary={mockPeriodSummary}
        />
      </section>

      <section className="content-grid">
        <FeatureListCard title="Flujo inicial" items={dashboardHighlights} />
        <FeatureListCard
          title="Por que TypeScript aqui"
          items={learningTopics}
        />
      </section>
    </main>
  )
}
