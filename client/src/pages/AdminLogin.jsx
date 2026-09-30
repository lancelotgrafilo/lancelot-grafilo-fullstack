import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchCsrfToken } from '../hooks/useCsrf.js'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function AdminLogin() {
  usePageTitle('Admin Login')
  const { user, checking, refresh } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!checking && user) {
    const redirectTo = location.state?.from?.pathname || '/admin'
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return

    setError('')
    setSubmitting(true)

    try {
      const csrfToken = await fetchCsrfToken()

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      if (res.ok) {
        await refresh()
        const redirectTo = location.state?.from?.pathname || '/admin'
        navigate(redirectTo, { replace: true })
        return
      }

      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Login failed. Please try again.')
    } catch {
      setError('Could not reach the server. Please try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <SectionHeader title="Admin login" />
      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && (
            <p role="alert" style={{ color: 'var(--color-danger)', marginTop: 0 }}>
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
}