export default function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}