export default function TagChip({ children }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: 'var(--color-accent-soft)',
        color: 'var(--color-accent)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        padding: '0.2rem 0.6rem',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {children}
    </span>
  )
}