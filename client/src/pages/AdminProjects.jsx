import { useState } from 'react'
import { useFetch } from '../hooks/useFetch.js'
import { fetchCsrfToken } from '../hooks/useCsrf.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import TagChip from '../components/ui/TagChip.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useNotify } from '../context/NotificationContext.jsx'

const EMPTY_FORM = {
  title: '', summary: '', description: '', repo_url: '', live_url: '', featured: false, techInput: '',
}

export default function AdminProjects() {
  usePageTitle('Manage Projects')
  const { data: projects, error, loading, retry } = useFetch('/api/projects')
  const [localProjects, setLocalProjects] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const notify = useNotify()

  const list = localProjects ?? projects

  async function withCsrf() {
    return { 'x-csrf-token': await fetchCsrfToken() }
  }

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setFormOpen(true)
  }

  async function openEdit(id) {
    setEditingId(id)
    setFormErrors({})
    const res = await fetch(`/api/projects/admin/${id}`, { credentials: 'same-origin' })
    if (res.ok) {
      const p = await res.json()
      setForm({
        title: p.title, summary: p.summary, description: p.description || '',
        repo_url: p.repo_url || '', live_url: p.live_url || '', featured: p.featured,
        techInput: (p.tech || []).join(', '),
      })
      setFormOpen(true)
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const headers = { ...(await withCsrf()), 'Content-Type': 'application/json' }
      const tech = form.techInput.split(',').map((t) => t.trim()).filter(Boolean)
      const payload = {
        title: form.title, summary: form.summary, description: form.description,
        repo_url: form.repo_url, live_url: form.live_url, featured: form.featured, tech,
      }

      const url = editingId ? `/api/projects/${editingId}` : '/api/projects'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, { method, credentials: 'same-origin', headers, body: JSON.stringify(payload) })

      if (res.status === 201 || res.status === 200) {
        setFormOpen(false)
        setLocalProjects(null)
        retry()
        notify.success(editingId ? 'Project updated.' : 'Project created.')
        return
      }

      const data = await res.json().catch(() => ({}))
      if (data.fields) setFormErrors(data.fields)
        notify.error(data.error || 'Could not save the project.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    setDeleting(true)
    try {
      const headers = await withCsrf()
      const res = await fetch(`/api/projects/${pendingDelete.id}`, { method: 'DELETE', credentials: 'same-origin', headers })
      if (res.ok) {
        setLocalProjects((list ?? projects).filter((p) => p.id !== pendingDelete.id))
        notify.success('Project deleted.')
      } else {
        notify.error('Could not delete the project.')
      }
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionHeader title="Projects" subtitle="Manage what appears on your public site." />
        <Button onClick={openCreate}>+ New project</Button>
      </div>

      {loading && <LoadingState label="Loading projects..." />}
      {error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && list?.length === 0 && (
        <EmptyState title="No projects yet" message="Click “New project” to add your first one." />
      )}

      {list?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {list.map((p) => (
            <Card key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{p.title}</strong>
                {p.featured && (
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--color-accent)' }}>Featured</span>
                )}
                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                  {p.tech.split(', ').filter(Boolean).map((t) => <TagChip key={t}>{t}</TagChip>)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                <Button variant="secondary" onClick={() => openEdit(p.id)}>Edit</Button>
                <Button variant="ghost" onClick={() => setPendingDelete(p)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        title={editingId ? 'Edit project' : 'New project'}
        confirmLabel={saving ? 'Saving...' : 'Save'}
        busy={saving}
        onCancel={() => setFormOpen(false)}
        onConfirm={handleSave}
      >
        <form onSubmit={handleSave} noValidate style={{ textAlign: 'left' }}>
          <FormField label="Title" error={formErrors.title}>
            <input name="title" value={form.title} onChange={handleChange} maxLength={150} style={inputStyle} />
          </FormField>
          <FormField label="Summary" error={formErrors.summary}>
            <input name="summary" value={form.summary} onChange={handleChange} maxLength={300} style={inputStyle} />
          </FormField>
          <FormField label="Description">
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={inputStyle} />
          </FormField>
          <FormField label="GitHub URL">
            <input name="repo_url" value={form.repo_url} onChange={handleChange} style={inputStyle} />
          </FormField>
          <FormField label="Live URL">
            <input name="live_url" value={form.live_url} onChange={handleChange} style={inputStyle} />
          </FormField>
          <FormField label="Technologies (comma separated)">
            <input name="techInput" value={form.techInput} onChange={handleChange} style={inputStyle} />
          </FormField>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Featured on home page
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete this project?"
        variant="danger"
        confirmLabel="Delete"
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      >
        {pendingDelete && <>This will permanently delete <strong>{pendingDelete.title}</strong>. This cannot be undone.</>}
      </Modal>
    </div>
  )
}

function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 'var(--space-sm)' }}>
      <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 500 }}>{label}</label>
      {children}
      {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>{error}</p>}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)', background: 'var(--color-bg)',
  color: 'var(--color-text)', fontSize: '0.9rem', fontFamily: 'inherit', marginBottom: '0.2rem',
}