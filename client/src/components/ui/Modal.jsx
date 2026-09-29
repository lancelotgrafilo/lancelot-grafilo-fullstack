import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button.jsx'

export default function Modal({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default', // 'default' | 'danger'
  busy = false,
}) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div
      role="presentation"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-md)',
        zIndex: 100,
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--space-lg)',
          maxWidth: 420,
          width: '100%',
        }}
      >
        <h3 id="modal-title" style={{ marginTop: 0, color: 'var(--color-text)' }}>
          {title}
        </h3>
        <div style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={busy}
            style={{
              background: variant === 'danger' ? 'var(--color-danger)' : 'var(--color-accent)',
            }}
          >
            {busy ? 'Please wait...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}