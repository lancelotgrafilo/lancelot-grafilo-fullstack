export default function Button({
  children,
  variant = 'primary',
  as: Component = 'button',
  style,
  ...props
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-xs)',
    padding: '0.6rem 1.25rem',
    borderRadius: 'var(--radius-full)',
    fontWeight: 500,
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'background var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast), opacity var(--transition-fast)',
  }

  const variants = {
    primary: {
      background: 'var(--color-accent)',
      color: '#fff',
    },
    secondary: {
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      borderColor: 'var(--color-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-muted)',
    },
  }

  return (
    <Component
      className={`btn btn-${variant}`}
      style={{ ...base, ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </Component>
  )
}