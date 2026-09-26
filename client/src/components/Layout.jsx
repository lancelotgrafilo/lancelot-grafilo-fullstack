import { Link, Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import { useFetch } from '../hooks/useFetch.js'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const { data: health, error: healthError } = useFetch('/api/health')

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
        background: 'var(--color-header-bg)',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
      }}>
        <Link to="/" style={{ color: 'var(--color-text)', fontWeight: 600, fontSize: '1.05rem' }}>
          Lancelot Grafilo
        </Link>
        <nav style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <Link to="/projects" style={{ color: 'var(--color-text-muted)' }}>Projects</Link>
          <Link to="/about" style={{ color: 'var(--color-text-muted)' }}>About</Link>
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--color-text)',
                width: '2.25rem',
                height: '2.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label="Toggle theme"
            >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
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
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 'var(--radius-full)',
                background: health?.database === 'connected'
                  ? '#22C55E'
                  : (health || healthError) ? '#EF4444' : 'var(--color-text-muted)',
                display: 'inline-block',
              }}
            />
            API: {health
              ? (health.database === 'connected' ? 'online' : 'degraded')
              : healthError
                ? 'offline'
                : 'checking...'}
        </span>
      </footer>
    </div>
  )
}