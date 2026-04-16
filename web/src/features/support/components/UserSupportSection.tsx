import { useEffect, useState } from 'react'
import type { User } from '../../../types/auth'
import {
  cloneSupportUserRecord,
  createSupportDraftRecord,
  getNextSupportStatus,
  getSupportActionAccess,
  supportStatusLabels,
  type SupportUserRecord,
} from '../model/supportUser'

type UserSupportSectionProps = {
  currentUser: User
  initialRecords: SupportUserRecord[]
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function UserSupportSection({
  currentUser,
  initialRecords,
}: UserSupportSectionProps) {
  const [records, setRecords] = useState(() =>
    initialRecords.map(cloneSupportUserRecord),
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(initialRecords[0]?.id ?? '')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const access = getSupportActionAccess(currentUser.permissions)

  const filteredRecords = records.filter((record) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return true
    }

    return (
      record.user.name.toLowerCase().includes(normalizedSearch) ||
      record.user.username.toLowerCase().includes(normalizedSearch) ||
      record.user.email.toLowerCase().includes(normalizedSearch)
    )
  })

  useEffect(() => {
    const hasSelectedRecord = filteredRecords.some(
      (record) => record.id === selectedUserId,
    )

    if (!hasSelectedRecord) {
      setSelectedUserId(filteredRecords[0]?.id ?? '')
    }
  }, [filteredRecords, selectedUserId])

  if (!access.canView) {
    return (
      <article className="content-card">
        <p>No tienes permisos para visualizar la seccion de soporte.</p>
      </article>
    )
  }

  const selectedRecord =
    filteredRecords.find((record) => record.id === selectedUserId) ??
    filteredRecords[0] ??
    null

  function handleCreateUser() {
    if (!access.canCreate) {
      return
    }

    const nextRecord = createSupportDraftRecord(records.length + 1, searchTerm)
    setRecords((currentRecords) => [nextRecord, ...currentRecords])
    setSelectedUserId(nextRecord.id)
    setFeedbackMessage(`Se ha preparado un usuario borrador: ${nextRecord.user.username}.`)
  }

  function handleUpdateUser() {
    if (!access.canUpdate || !selectedRecord) {
      return
    }

    const nextStatus = getNextSupportStatus(selectedRecord.supportStatus)

    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === selectedRecord.id
          ? {
              ...record,
              lastAccessAt: new Date().toISOString(),
              supportStatus: nextStatus,
              notes: `Revision aplicada desde soporte. Estado actual: ${supportStatusLabels[nextStatus]}.`,
            }
          : record,
      ),
    )

    setFeedbackMessage(`Usuario actualizado: ${selectedRecord.user.username}.`)
  }

  function handleDeleteUser() {
    if (!access.canDelete || !selectedRecord) {
      return
    }

    setRecords((currentRecords) =>
      currentRecords.filter((record) => record.id !== selectedRecord.id),
    )
    setFeedbackMessage(`Usuario eliminado de la vista de soporte: ${selectedRecord.user.username}.`)
  }

  return (
    <section className="content-card support-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Support / Buscar usuario</p>
          <h2>Revision de usuarios y detalle de dashboard</h2>
          <p className="support-copy">
            Esta primera subseccion queda reservada al perfil administrador para
            revisar usuarios, su estado actual y la preparacion de futuras
            acciones sobre permisos.
          </p>
        </div>
        <span className="section-counter">{filteredRecords.length} usuarios</span>
      </div>

      <div className="support-toolbar">
        <label className="support-search">
          <span>Buscar usuario</span>
          <input
            placeholder="Nombre, username o email"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <div className="support-actions">
          <button
            className="support-action-button"
            disabled={!access.canCreate}
            onClick={handleCreateUser}
            type="button"
          >
            Anadir
          </button>
          <button
            className="support-action-button"
            disabled={!access.canUpdate || !selectedRecord}
            onClick={handleUpdateUser}
            type="button"
          >
            Modificar
          </button>
          <button
            className="support-action-button support-action-button--danger"
            disabled={!access.canDelete || !selectedRecord}
            onClick={handleDeleteUser}
            type="button"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="support-grants">
        <span className="grant-pill">VIEW</span>
        {access.canCreate ? <span className="grant-pill">ADD</span> : null}
        {access.canUpdate ? <span className="grant-pill">EDIT</span> : null}
        {access.canDelete ? <span className="grant-pill">DELETE</span> : null}
      </div>

      {feedbackMessage ? <p className="support-feedback">{feedbackMessage}</p> : null}

      <div className="support-grid">
        <div className="support-list-panel">
          <ul className="support-user-list">
            {filteredRecords.map((record) => {
              const isSelected = record.id === selectedRecord?.id

              return (
                <li key={record.id}>
                  <button
                    className={
                      isSelected
                        ? 'support-user-card support-user-card--active'
                        : 'support-user-card'
                    }
                    onClick={() => setSelectedUserId(record.id)}
                    type="button"
                  >
                    <span className="support-user-card__title">{record.user.name}</span>
                    <span>@{record.user.username}</span>
                    <span>{record.user.role}</span>
                    <small>{supportStatusLabels[record.supportStatus]}</small>
                  </button>
                </li>
              )
            })}
          </ul>

          {!filteredRecords.length ? (
            <div className="support-empty">
              <p>No hay usuarios que coincidan con la busqueda actual.</p>
            </div>
          ) : null}
        </div>

        <div className="support-detail-panel">
          {selectedRecord ? (
            <>
              <div className="support-detail-header">
                <div>
                  <p className="eyebrow">Detalle del usuario</p>
                  <h3>{selectedRecord.user.name}</h3>
                  <p className="support-copy">
                    @{selectedRecord.user.username} · {selectedRecord.user.email}
                  </p>
                </div>
                <span
                  className={`support-status support-status--${selectedRecord.supportStatus}`}
                >
                  {supportStatusLabels[selectedRecord.supportStatus]}
                </span>
              </div>

              <div className="support-detail-grid">
                <div className="support-metric">
                  <span>Rol</span>
                  <strong>{selectedRecord.user.role}</strong>
                </div>
                <div className="support-metric">
                  <span>Ultimo acceso</span>
                  <strong>{new Date(selectedRecord.lastAccessAt).toLocaleString('es-ES')}</strong>
                </div>
                <div className="support-metric">
                  <span>Extracto actual</span>
                  <strong>{selectedRecord.statement.fileName}</strong>
                </div>
                <div className="support-metric">
                  <span>Movimientos</span>
                  <strong>{selectedRecord.summary.movementCount}</strong>
                </div>
                <div className="support-metric">
                  <span>Periodo neto</span>
                  <strong>{currencyFormatter.format(selectedRecord.summary.netTotal)}</strong>
                </div>
                <div className="support-metric">
                  <span>Estado del extracto</span>
                  <strong>{selectedRecord.statement.status}</strong>
                </div>
              </div>

              <div className="support-block">
                <h4>Permisos del usuario</h4>
                <div className="permission-list">
                  {selectedRecord.user.permissions.map((permission) => (
                    <span className="permission-pill" key={permission}>
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <div className="support-block">
                <h4>Resumen de dashboard</h4>
                <p>{selectedRecord.notes}</p>
                <dl className="statement-meta">
                  <div>
                    <dt>Banco</dt>
                    <dd>{selectedRecord.statement.sourceBank}</dd>
                  </div>
                  <div>
                    <dt>Periodo</dt>
                    <dd>
                      {selectedRecord.summary.periodMonth}/{selectedRecord.summary.periodYear}
                    </dd>
                  </div>
                  <div>
                    <dt>Ingresos</dt>
                    <dd>{currencyFormatter.format(selectedRecord.summary.incomeTotal)}</dd>
                  </div>
                </dl>
              </div>
            </>
          ) : (
            <div className="support-empty">
              <p>Selecciona un usuario para revisar sus detalles.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
