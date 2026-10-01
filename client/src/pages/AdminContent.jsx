import { useState } from 'react'
import { useFetch } from '../hooks/useFetch.js'
import { fetchCsrfToken } from '../hooks/useCsrf.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { API_BASE } from '../config/api.js'

const SKILL_EMPTY = { name: '', category: '', sort_order: 0 }
const EXP_EMPTY = { title: '', organization: '', start_date: '', end_date: '', description: '' }

export default function AdminContent() {
  usePageTitle('Manage Content')
  return (
    <div>
      <SectionHeader title="Skills & Experience" subtitle="Manage your About page content." />
      <AboutSection />
      <SkillsSection />
      <div style={{ marginTop: 'var(--space-lg)' }}>
        <ExperienceSection />
      </div>
    </div>
  )
}

function AboutSection() {
  const { data, loading, retry } = useFetch(`${API_BASE}/api/about`)
  const [intro, setIntro] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const displayIntro = intro !== null ? intro : (data?.intro ?? '')

  function startEditing() {
    setIntro(data?.intro ?? '')
    setEditing(true)
  }

  function cancelEditing() {
    setIntro(null)
    setEditing(false)
    setError('')
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const csrfToken = await fetchCsrfToken()
      const res = await fetch(`${API_BASE}/api/about`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'x-csrf-token': csrfToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ intro: displayIntro }),
      })
      if (res.ok) {
        setIntro(null)
        setEditing(false)
        retry()
      } else {
        const d = await res.json().catch(() => ({}))
        setError(d.fields?.intro || d.error || 'Could not save.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
        <h3 style={{ margin: 0 }}>About intro</h3>
        {!editing && <Button variant="secondary" onClick={startEditing}>Edit</Button>}
      </div>

      {loading && <LoadingState label="Loading..." />}

      {!loading && !editing && (
        <Card><p style={{ margin: 0, whiteSpace: 'pre-line' }}>{data?.intro}</p></Card>
      )}

      {editing && (
        <Card>
          <textarea
            value={displayIntro}
            onChange={(e) => setIntro(e.target.value)}
            rows={5}
            maxLength={2000}
            style={{
              width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)', background: 'var(--color-bg)',
              color: 'var(--color-text)', fontFamily: 'inherit', fontSize: '0.9rem',
            }}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right', margin: '0.2rem 0 0.6rem' }}>
            {displayIntro.length} / 2000
          </p>
          {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button variant="secondary" onClick={cancelEditing} disabled={saving}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

function SkillsSection() {
  const { data: skills, loading, retry } = useFetch(`${API_BASE}/api/skills`)
  const [local, setLocal] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(SKILL_EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const list = local ?? skills

  async function withCsrf() {
    return { 'x-csrf-token': await fetchCsrfToken() }
  }

  function openCreate() {
    setEditingId(null)
    setForm(SKILL_EMPTY)
    setErrors({})
    setFormOpen(true)
  }

  function openEdit(skill) {
    setEditingId(skill.id)
    setForm({ name: skill.name, category: skill.category, sort_order: skill.sort_order })
    setErrors({})
    setFormOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const headers = { ...(await withCsrf()), 'Content-Type': 'application/json' }
      const url = editingId ? `${API_BASE}/api/skills/${editingId}` : '/api/skills'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, credentials: 'same-origin', headers, body: JSON.stringify(form) })

      if (res.ok) {
        setFormOpen(false)
        setLocal(null)
        retry()
        return
      }
      const data = await res.json().catch(() => ({}))
      if (data.fields) setErrors(data.fields)
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    const headers = await withCsrf()
    const res = await fetch(`${API_BASE}/api/skills/${pendingDelete.id}`, { method: 'DELETE', credentials: 'same-origin', headers })
    if (res.ok) setLocal((list ?? skills).filter((s) => s.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
        <h3 style={{ margin: 0 }}>Skills</h3>
        <Button onClick={openCreate}>+ Add skill</Button>
      </div>

      {loading && <LoadingState label="Loading skills..." />}
      {!loading && list?.length === 0 && <EmptyState title="No skills yet" />}

      {list?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-sm)' }}>
          {list.map((s) => (
            <Card key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{s.name}</strong>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{s.category}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <Button variant="secondary" onClick={() => openEdit(s)}>Edit</Button>
                <Button variant="ghost" onClick={() => setPendingDelete(s)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        title={editingId ? 'Edit skill' : 'New skill'}
        confirmLabel={saving ? 'Saving...' : 'Save'}
        busy={saving}
        onCancel={() => setFormOpen(false)}
        onConfirm={handleSave}
      >
        <form onSubmit={handleSave} noValidate style={{ textAlign: 'left' }}>
          <FormField label="Name" error={errors.name}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          </FormField>
          <FormField label="Category" error={errors.category}>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle} />
          </FormField>
          <FormField label="Sort order">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              style={inputStyle}
            />
          </FormField>
        </form>
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete this skill?"
        variant="danger"
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      >
        {pendingDelete && <>This will remove <strong>{pendingDelete.name}</strong> from your About page.</>}
      </Modal>
    </div>
  )
}

function ExperienceSection() {
  const { data: experience, loading, retry } = useFetch(`${API_BASE}/api/experience`)
  const [local, setLocal] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EXP_EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const list = local ?? experience

  async function withCsrf() {
    return { 'x-csrf-token': await fetchCsrfToken() }
  }

  function openCreate() {
    setEditingId(null)
    setForm(EXP_EMPTY)
    setErrors({})
    setFormOpen(true)
  }

  function openEdit(item) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      organization: item.organization,
      start_date: item.start_date?.slice(0, 10) || '',
      end_date: item.end_date?.slice(0, 10) || '',
      description: item.description || '',
    })
    setErrors({})
    setFormOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const headers = { ...(await withCsrf()), 'Content-Type': 'application/json' }
      const url = editingId ? `${API_BASE}/api/experience/${editingId}` : '/api/experience'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, credentials: 'same-origin', headers, body: JSON.stringify(form) })

      if (res.ok) {
        setFormOpen(false)
        setLocal(null)
        retry()
        return
      }
      const data = await res.json().catch(() => ({}))
      if (data.fields) setErrors(data.fields)
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    const headers = await withCsrf()
    const res = await fetch(`${API_BASE}/api/experience/${pendingDelete.id}`, { method: 'DELETE', credentials: 'same-origin', headers })
    if (res.ok) setLocal((list ?? experience).filter((x) => x.id !== pendingDelete.id))
    setPendingDelete(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
        <h3 style={{ margin: 0 }}>Experience</h3>
        <Button onClick={openCreate}>+ Add experience</Button>
      </div>

      {loading && <LoadingState label="Loading experience..." />}
      {!loading && list?.length === 0 && <EmptyState title="No experience entries yet" />}

      {list?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {list.map((item) => (
            <Card key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{item.title}</strong>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  {item.organization} · {item.start_date?.slice(0, 10)} to {item.end_date ? item.end_date.slice(0, 10) : 'Present'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <Button variant="secondary" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="ghost" onClick={() => setPendingDelete(item)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        title={editingId ? 'Edit experience' : 'New experience'}
        confirmLabel={saving ? 'Saving...' : 'Save'}
        busy={saving}
        onCancel={() => setFormOpen(false)}
        onConfirm={handleSave}
      >
        <form onSubmit={handleSave} noValidate style={{ textAlign: 'left' }}>
          <FormField label="Title" error={errors.title}>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          </FormField>
          <FormField label="Organization" error={errors.organization}>
            <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} style={inputStyle} />
          </FormField>
          <FormField label="Start date" error={errors.start_date}>
            <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
          </FormField>
          <FormField label="End date (blank if ongoing)" error={errors.end_date}>
            <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
          </FormField>
          <FormField label="Description" error={errors.description}>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={inputStyle} />
          </FormField>
        </form>
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete this entry?"
        variant="danger"
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      >
        {pendingDelete && <>This will remove <strong>{pendingDelete.title}</strong> from your About page.</>}
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