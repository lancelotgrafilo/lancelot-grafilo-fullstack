import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

const NotificationContext = createContext(null)

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
}

const COLOR_VAR = {
  success: '--color-success',
  error: '--color-danger',
  warning: '--color-warning',
  info: '--color-info',
}

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setItems((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const notify = useCallback((type, message, options = {}) => {
    const id = ++idRef.current
    const duration = options.duration ?? (type === 'error' ? 7000 : 4500)
    setItems((prev) => [...prev, { id, type, message }])
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  const api = {
    notify,
    success: (message, options) => notify('success', message, options),
    error: (message, options) => notify('error', message, options),
    warning: (message, options) => notify('warning', message, options),
    info: (message, options) => notify('info', message, options),
    dismiss,
  }

  return (
    <NotificationContext.Provider value={api}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          style={{
            position: 'fixed',
            top: 'var(--space-md)',
            right: 'var(--space-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xs)',
            zIndex: 200,
            maxWidth: 360,
            width: 'calc(100% - 2 * var(--space-md))',
          }}
        >
          {items.map((n) => (
            <Toast key={n.id} item={n} onDismiss={() => dismiss(n.id)} />
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  )
}

function Toast({ item, onDismiss }) {
  const colorVar = `var(${COLOR_VAR[item.type]})`

  return (
    <div
      role={item.type === 'error' ? 'alert' : 'status'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-xs)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderLeft: `3px solid ${colorVar}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        padding: '0.75rem var(--space-sm)',
        animation: 'toast-in 180ms ease',
      }}
    >
      <span style={{ color: colorVar, flexShrink: 0, marginTop: '1px' }}>{ICONS[item.type]}</span>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text)', flex: 1 }}>{item.message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          background: 'none', border: 'none', color: 'var(--color-text-muted)',
          cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '1rem',
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export function useNotify() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotify must be used within a NotificationProvider')
  }
  return context
}