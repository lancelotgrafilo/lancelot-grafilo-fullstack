  export default function EmptyState({ title = 'Nothing here yet', message }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-xl) var(--space-md)',
        color: 'var(--color-text-muted)',
      }}
    >
      <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-xs)' }}>
        {title}
      </p>
      {message && <p style={{ margin: 0 }}>{message}</p>}
    </div>
  )
}