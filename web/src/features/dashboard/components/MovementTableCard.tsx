import type { Movement } from '../../../types/statements'

type MovementTableCardProps = {
  movements: Movement[]
  eyebrow?: string
  title?: string
}

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function MovementTableCard({
  movements,
  eyebrow = 'Movimientos',
  title = 'Ejemplo de visualizacion',
}: MovementTableCardProps) {
  return (
    <article className="content-card movement-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <span className="section-counter">{movements.length} registros</span>
      </div>

      <div className="movement-table-wrapper">
        <table className="movement-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripcion</th>
              <th>Categoria</th>
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
                <td
                  className={
                    movement.amount > 0
                      ? 'amount amount--positive'
                      : 'amount amount--negative'
                  }
                >
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
