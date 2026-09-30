import { useState } from 'react'
import { useFetch } from '../hooks/useFetch.js'
import { fetchCsrfToken } from '../hooks/useCsrf.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function AdminDashboard() {
  usePageTitle('Messages')
  const { data: messages, error, loading, retry } = useFetch('/api/messages')
  const [busyId, setBusyId] = useState(null)
  const [localMessages, setLocalMessages] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const list = localMessages ?? messages

  async function withCsrf() {
    const csrfToken = await fetchCsrfToken()
    return { 'x-csrf-token': csrfToken }
  }

  async function handleMarkRead(id) {
    setBusyId(id)
    try {
      const headers = await withCsrf()
      const res = await fetch(`/api/messages/${id}/read`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers,
      })
      if (res.ok) {
        setLocalMessages((list ?? messages).map((m) => (m.id === id ? { ...m, is_read: true } : m)))
      }
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    const id = pendingDelete.id
    setBusyId(id)
    try {
      const headers = await withCsrf()
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers,
      })
      if (res.ok) {
        setLocalMessages((list ?? messages).filter((m) => m.id !== id))
      }
    } finally {
      setBusyId(null)
      setPendingDelete(null)
    }
  }

  return (
    <div>
      <SectionHeader title="Messages" subtitle="Contact form submissions." />

      {loading && <LoadingState label="Loading messages..." />}
      {error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && list?.length === 0 && (
        <EmptyState title="No messages yet" message="Submissions from the contact form will show up here." />
      )}

      {list?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {list.map((m) => (
            <Card key={m.id} style={{ opacity: m.is_read ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.4rem' }}>
                <div>
                  <strong>{m.name}</strong>
                  <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                    {m.email}
                  </span>
                </div>
                {!m.is_read && (
                  <span style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    New
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 0.6rem', color: 'var(--color-text-muted)' }}>{m.message}</p>
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                {!m.is_read && (
                  <Button variant="secondary" disabled={busyId === m.id} onClick={() => handleMarkRead(m.id)}>
                    Mark read
                  </Button>
                )}
                <Button variant="ghost" disabled={busyId === m.id} onClick={() => setPendingDelete(m)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete this message?"
        variant="danger"
        confirmLabel="Delete"
        busy={busyId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      >
        {pendingDelete && (
          <>
            This will permanently delete the message from <strong>{pendingDelete.name}</strong>. This cannot be undone.
          </>
        )}
      </Modal>
    </div>
  )
}