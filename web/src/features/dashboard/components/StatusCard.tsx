type StatusCardProps = {
  label: string
  value: string
  description: string
}

export function StatusCard({ label, value, description }: StatusCardProps) {
  return (
    <article className="status-card">
      <span className="status-label">{label}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  )
}
