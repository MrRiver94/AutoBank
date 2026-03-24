type FeatureListCardProps = {
  title: string
  items: string[]
}

export function FeatureListCard({ title, items }: FeatureListCardProps) {
  return (
    <article className="content-card">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
