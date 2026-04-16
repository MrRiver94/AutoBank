import { useState } from 'react'
import { MovementTableCard } from '../../dashboard/components/MovementTableCard'
import { StatementSummaryCard } from '../../dashboard/components/StatementSummaryCard'
import { parseStatementFile } from '../utils/parseStatementFile'
import type { User } from '../../../types/auth'
import type { ParsedStatementData } from '../../../types/statements'

type StatementUploadSectionProps = {
  currentUser: User
  parsedStatementsData: ParsedStatementData[]
  onOpenDashboard: () => void
  onStatementsParsed: (data: ParsedStatementData[]) => void
}

export function StatementUploadSection({
  currentUser,
  parsedStatementsData,
  onOpenDashboard,
  onStatementsParsed,
}: StatementUploadSectionProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isParsing, setIsParsing] = useState(false)

  async function handleParseFiles() {
    if (!selectedFiles.length) {
      setErrorMessage('Selecciona al menos un archivo CSV para poder parsearlo.')
      setSuccessMessage('')
      return
    }

    setIsParsing(true)
    setErrorMessage('')

    try {
      const parsedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileContent = await file.text()

          return parseStatementFile({
            content: fileContent,
            fileName: file.name,
            uploadedBy: currentUser.name,
          })
        }),
      )

      onStatementsParsed(parsedFiles)
      setSuccessMessage(
        `${parsedFiles.length} archivo(s) parseado(s) correctamente para el dashboard analitico.`,
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se ha podido leer el archivo seleccionado.'

      setErrorMessage(message)
      setSuccessMessage('')
    } finally {
      setIsParsing(false)
    }
  }

  return (
    <section className="content-card upload-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Extractos / Subida</p>
          <h2>Sube varios archivos y construye un dashboard por meses</h2>
          <p className="upload-copy">
            El flujo inicial espera CSVs simples con columnas de fecha,
            descripcion, importe, saldo y categoria. Puedes cargar varios meses
            para consolidar ingresos, gastos y tendencias en un unico dashboard.
          </p>
        </div>
        <span className="section-counter">{parsedStatementsData.length} meses cargados</span>
      </div>

      <div className="upload-grid">
        <div className="upload-panel">
          <label className="upload-field">
            <span>Archivos</span>
            <input
              accept=".csv,text/csv"
              multiple
              onChange={(event) => {
                setSelectedFiles(Array.from(event.target.files ?? []))
                setErrorMessage('')
                setSuccessMessage('')
              }}
              type="file"
            />
          </label>

          <p className="upload-helper">
            Formato recomendado: `date,description,amount,balance,category`
          </p>

          <div className="upload-actions">
            <button
              className="upload-button"
              disabled={isParsing}
              onClick={handleParseFiles}
              type="button"
            >
              {isParsing ? 'Parseando...' : 'Parsear archivos'}
            </button>

            {parsedStatementsData.length ? (
              <button
                className="upload-button upload-button--secondary"
                onClick={onOpenDashboard}
                type="button"
              >
                Ir al dashboard
              </button>
            ) : null}
          </div>

          {selectedFiles.length ? (
            <div className="upload-selected-list">
              {selectedFiles.map((file) => (
                <p className="upload-selected" key={file.name}>
                  Archivo seleccionado: {file.name}
                </p>
              ))}
            </div>
          ) : null}

          {errorMessage ? <p className="upload-error">{errorMessage}</p> : null}
          {successMessage ? <p className="upload-success">{successMessage}</p> : null}
        </div>

        <div className="upload-panel upload-panel--sample">
          <p className="eyebrow">Plantilla rapida</p>
          <pre className="upload-sample">
date,description,amount,balance,category
2026-03-01,Nomina,2450,3420.15,Ingresos
2026-03-03,Alquiler,-850,2570.15,Vivienda
2026-03-07,Supermercado,-126.45,2443.70,Alimentacion
          </pre>
        </div>
      </div>

      {parsedStatementsData.length ? (
        <div className="upload-preview">
          <StatementSummaryCard
            statement={parsedStatementsData[parsedStatementsData.length - 1].statement}
            summary={parsedStatementsData[parsedStatementsData.length - 1].summary}
          />
          <MovementTableCard
            movements={parsedStatementsData.flatMap((statementData) => statementData.movements).slice(0, 8)}
          />
        </div>
      ) : null}
    </section>
  )
}
