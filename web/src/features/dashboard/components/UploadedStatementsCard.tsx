import { useState } from 'react'
import type { ParsedStatementData } from '../../../types/statements'

type UploadedStatementsCardProps = {
  statements: ParsedStatementData[]
  selectedScopeKey: string
  onSelectScope: (scopeKey: string) => void
}

export function UploadedStatementsCard({
  statements,
  selectedScopeKey,
  onSelectScope,
}: UploadedStatementsCardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const orderedStatements = [...statements].sort((left, right) => {
    const leftKey = `${left.statement.periodYear}-${String(left.statement.periodMonth).padStart(2, '0')}`
    const rightKey = `${right.statement.periodYear}-${String(right.statement.periodMonth).padStart(2, '0')}`

    return rightKey.localeCompare(leftKey)
  })
  const filteredStatements = orderedStatements.filter((statementData) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return true
    }

    return (
      statementData.statement.fileName.toLowerCase().includes(normalizedSearch) ||
      statementData.statement.sourceBank.toLowerCase().includes(normalizedSearch) ||
      `${String(statementData.statement.periodMonth).padStart(2, '0')}/${statementData.statement.periodYear}`.includes(
        normalizedSearch,
      )
    )
  })
  const groupedStatements = filteredStatements.reduce<
    Record<string, ParsedStatementData[]>
  >((groups, statementData) => {
    const year = String(statementData.statement.periodYear)
    const currentGroup = groups[year] ?? []
    currentGroup.push(statementData)
    groups[year] = currentGroup
    return groups
  }, {})

  return (
    <article className="content-card uploaded-statements-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Extractos cargados</p>
          <h2>Meses disponibles para el analisis</h2>
        </div>
        <span className="section-counter">{statements.length} archivos</span>
      </div>

      <label className="uploaded-statements-search">
        <span>Buscar extracto</span>
        <input
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Ej: 03/2026 o marzo"
          value={searchTerm}
        />
      </label>

      <div className="uploaded-statements-list">
        {Object.entries(groupedStatements).map(([year, statementsForYear]) => (
          <section className="uploaded-statements-group" key={year}>
            <p className="uploaded-statements-group__title">{year}</p>
            <div className="uploaded-statements-group__items">
              {statementsForYear.map((statementData) => {
                const scopeKey = `${statementData.statement.periodYear}-${String(statementData.statement.periodMonth).padStart(2, '0')}`
                const isActive = selectedScopeKey === scopeKey

                return (
                  <button
                    className={
                      isActive
                        ? 'uploaded-statements-item uploaded-statements-item--active'
                        : 'uploaded-statements-item'
                    }
                    key={statementData.statement.id}
                    onClick={() => onSelectScope(scopeKey)}
                    type="button"
                  >
                    <strong>{statementData.statement.fileName}</strong>
                    <span>
                      {String(statementData.statement.periodMonth).padStart(2, '0')}/
                      {statementData.statement.periodYear}
                    </span>
                    <small>{statementData.summary.movementCount} movimientos</small>
                  </button>
                )
              })}
            </div>
          </section>
        ))}

        {!filteredStatements.length ? (
          <div className="uploaded-statements-empty">
            <p>No hay extractos que coincidan con la busqueda.</p>
          </div>
        ) : null}
      </div>
    </article>
  )
}
