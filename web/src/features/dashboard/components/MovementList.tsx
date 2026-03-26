import type { Movement } from '../../../types/statements'

type MovementListProps = {
  movements: Movement[]
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function MovementList({ movements }: MovementListProps) {
  return (
    <article className="content-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Movimientos</p>
          <h2>Ejemplo de visualización</h2>
        </div>
        <span className="section-counter">{movements.length} registros</span>
      </div>

      <div className="movement-table-wrapper">
        <table className="movement-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Importe</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td>{movement.date}</td>
                <td>{movement.description}</td>
                <td>{movement.category}</td>
                <td className={movement.amount > 0 ? 'amount amount--positive' : 'amount amount--negative'}>
                  {currencyFormatter.format(movement.amount)}
                </td>
                <td>{currencyFormatter.format(movement.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
