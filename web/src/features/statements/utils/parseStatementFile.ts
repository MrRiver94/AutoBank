import type { Movement, ParsedStatementData, Statement } from '../../../types/statements'

type ParseStatementFileParams = {
  content: string
  fileName: string
  uploadedBy: string
}

const REQUIRED_HEADERS = {
  date: ['date', 'fecha'],
  description: ['description', 'descripcion', 'concepto'],
  amount: ['amount', 'importe'],
  balance: ['balance', 'saldo'],
  category: ['category', 'categoria'],
}

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function parseCsvLine(line: string, delimiter: string) {
  const values: string[] = []
  let currentValue = ''
  let isInsideQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]

    if (character === '"') {
      isInsideQuotes = !isInsideQuotes
      continue
    }

    if (character === delimiter && !isInsideQuotes) {
      values.push(currentValue.trim())
      currentValue = ''
      continue
    }

    currentValue += character
  }

  values.push(currentValue.trim())
  return values
}

function detectDelimiter(headerLine: string) {
  const semicolonCount = headerLine.split(';').length
  const commaCount = headerLine.split(',').length

  return semicolonCount > commaCount ? ';' : ','
}

function resolveHeaderIndex(headers: string[], aliases: string[], label: string) {
  const headerIndex = headers.findIndex((header) => aliases.includes(header))

  if (headerIndex === -1) {
    throw new Error(`Falta la columna requerida: ${label}.`)
  }

  return headerIndex
}

function normalizeDate(rawDate: string) {
  const value = rawDate.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/')
    return `${year}-${month}-${day}`
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split('-')
    return `${year}-${month}-${day}`
  }

  throw new Error(`Fecha no valida: ${rawDate}. Usa YYYY-MM-DD o DD/MM/YYYY.`)
}

function parseAmount(rawValue: string) {
  const value = rawValue.trim().replace(/\s/g, '').replace(/€/g, '')

  if (!value) {
    return 0
  }

  if (value.includes(',') && value.includes('.')) {
    if (value.lastIndexOf(',') > value.lastIndexOf('.')) {
      return Number(value.replace(/\./g, '').replace(',', '.'))
    }

    return Number(value.replace(/,/g, ''))
  }

  if (value.includes(',')) {
    return Number(value.replace(',', '.'))
  }

  return Number(value)
}

function buildStatementId(fileName: string) {
  return `statement-${fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function buildStatement(
  fileName: string,
  uploadedBy: string,
  firstMovementDate: string,
): Statement {
  const [periodYear, periodMonth] = firstMovementDate.split('-')

  return {
    id: buildStatementId(fileName),
    fileName,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
    periodMonth: Number(periodMonth),
    periodYear: Number(periodYear),
    sourceBank: 'Archivo cargado',
    status: 'processed',
  }
}

export function parseStatementFile({
  content,
  fileName,
  uploadedBy,
}: ParseStatementFileParams): ParsedStatementData {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    throw new Error('El archivo debe incluir cabecera y al menos una linea de movimientos.')
  }

  const delimiter = detectDelimiter(lines[0])
  const headers = parseCsvLine(lines[0], delimiter).map(normalizeHeader)

  const dateIndex = resolveHeaderIndex(headers, REQUIRED_HEADERS.date, 'date / fecha')
  const descriptionIndex = resolveHeaderIndex(
    headers,
    REQUIRED_HEADERS.description,
    'description / descripcion',
  )
  const amountIndex = resolveHeaderIndex(headers, REQUIRED_HEADERS.amount, 'amount / importe')
  const balanceIndex = resolveHeaderIndex(headers, REQUIRED_HEADERS.balance, 'balance / saldo')
  const categoryIndex = headers.findIndex((header) =>
    REQUIRED_HEADERS.category.includes(header),
  )

  const movements: Movement[] = lines.slice(1).map((line, index) => {
    const columns = parseCsvLine(line, delimiter)
    const amount = parseAmount(columns[amountIndex] ?? '')
    const balance = parseAmount(columns[balanceIndex] ?? '')
    const date = normalizeDate(columns[dateIndex] ?? '')

    if (Number.isNaN(amount) || Number.isNaN(balance)) {
      throw new Error(`Importe o saldo no valido en la linea ${index + 2}.`)
    }

    return {
      id: `movement-${index + 1}`,
      statementId: buildStatementId(fileName),
      date,
      description: columns[descriptionIndex] ?? 'Sin descripcion',
      amount,
      balance,
      type: amount >= 0 ? 'income' : 'expense',
      category:
        categoryIndex >= 0 && columns[categoryIndex]
          ? columns[categoryIndex]
          : 'Sin categoria',
    }
  })

  const firstMovementDate = movements[0]?.date

  if (!firstMovementDate) {
    throw new Error('No se han podido leer movimientos validos del archivo.')
  }

  const incomeTotal = movements
    .filter((movement) => movement.amount > 0)
    .reduce((total, movement) => total + movement.amount, 0)

  const expenseTotal = movements
    .filter((movement) => movement.amount < 0)
    .reduce((total, movement) => total + Math.abs(movement.amount), 0)

  const statement = buildStatement(fileName, uploadedBy, firstMovementDate)

  return {
    statement,
    movements,
    summary: {
      incomeTotal,
      expenseTotal,
      netTotal: incomeTotal - expenseTotal,
      movementCount: movements.length,
      periodMonth: statement.periodMonth,
      periodYear: statement.periodYear,
    },
  }
}
