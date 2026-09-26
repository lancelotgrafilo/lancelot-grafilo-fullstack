import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-md) var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
      }}>
        <Link to="/" style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '1.05rem' }}>
          Lancelot Grafilo
        </Link>
        <nav style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <Link to="/projects" style={{ color: 'var(--color-text-muted)' }}>Projects</Link>
          <Link to="/about" style={{ color: 'var(--color-text-muted)' }}>About</Link>
          <Link
            to="/contact"
            style={{
              color: '#fff',
              background: 'var(--color-accent)',
              padding: '0.5rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          >
            Contact
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: 'var(--space-lg)', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>

      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-md) var(--space-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        color: 'var(--color-text-muted)',
        fontSize: '0.85rem',
      }}>
        <span>Lancelot Grafilo</span>
        <span>API: checking...</span>
      </footer>
    </div>
  )
}