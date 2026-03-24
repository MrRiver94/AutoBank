import './App.css'
import { mockCurrentUser, mockPeriodSummary } from '../features/dashboard/mockData'

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

        <div className="status-grid">
          <article className="status-card">
            <span className="status-label">Usuario actual</span>
            <strong>{mockCurrentUser.name}</strong>
            <p>{mockCurrentUser.role}</p>
          </article>

          <article className="status-card">
            <span className="status-label">Permiso principal</span>
            <strong>{mockCurrentUser.permissions[0]}</strong>
            <p>Modelo inicial de permisos del sistema</p>
          </article>

          <article className="status-card">
            <span className="status-label">Resumen del periodo</span>
            <strong>
              {mockPeriodSummary.periodMonth}/{mockPeriodSummary.periodYear}
            </strong>
            <p>{mockPeriodSummary.movementCount} movimientos cargados en mock</p>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <article className="content-card">
          <h2>Flujo inicial</h2>
          <ul>
            <li>Subir un extracto bancario</li>
            <li>Parsear y normalizar sus movimientos</li>
            <li>Visualizar datos del periodo</li>
            <li>Preparar el terreno para graficas y comparativas</li>
          </ul>
        </article>

        <article className="content-card">
          <h2>Por que TypeScript aqui</h2>
          <ul>
            <li>Modela usuarios, permisos, extractos y movimientos con precision</li>
            <li>Reduce errores al evolucionar la app</li>
            <li>Hace mas seguras las refactorizaciones</li>
            <li>Convierte los contratos del dominio en parte del codigo</li>
          </ul>
        </article>
      </section>
    </main>
  )
}
