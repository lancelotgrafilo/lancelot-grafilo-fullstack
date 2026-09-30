import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchCsrfToken } from '../hooks/useCsrf.js'
import Button from './ui/Button.jsx'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      const csrfToken = await fetchCsrfToken()
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'x-csrf-token': csrfToken },
      })
    } catch {
      // Even if the request fails, clear local state and send the admin to login
    } finally {
      logout()
      navigate('/admin/login', { replace: true })
    }
  }

  return (
    <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-lg)', minHeight: '60vh' }}>
      <aside style={{ borderRight: '1px solid var(--color-border)', paddingRight: 'var(--space-md)' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}>
          {user?.email}
        </p>
        <nav aria-label="Admin navigation" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <Link to="/admin" style={{ color: 'var(--color-text)' }}>Messages</Link>
          <Link to="/admin/projects" style={{ color: 'var(--color-text)' }}>Projects</Link>
          <Link to="/admin/content" style={{ color: 'var(--color-text)' }}>About, Skills & Experience</Link>
        </nav>
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Button variant="secondary" onClick={handleLogout} style={{ width: '100%' }}>
            Log out
          </Button>
        </div>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  )
}