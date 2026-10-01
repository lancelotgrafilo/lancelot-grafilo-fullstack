import { useState } from 'react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useNotify } from '../context/NotificationContext.jsx'
import { API_BASE } from '../config/api.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LIMITS = { name: 100, email: 254, message: 2000 }
const MIN_MESSAGE = 10

const EMPTY = { name: '', email: '', message: '', website: '' }

function validate(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const message = values.message.trim()

  if (name.length < 1 || name.length > LIMITS.name) {
    errors.name = `Name is required (max ${LIMITS.name} characters).`
  }
  if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = 'A valid email address is required.'
  }
  if (message.length < MIN_MESSAGE || message.length > LIMITS.message) {
    errors.message = `Message must be between ${MIN_MESSAGE} and ${LIMITS.message} characters.`
  }
  return errors
}

export default function Contact() {
  usePageTitle('Contact')
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [formError, setFormError] = useState('')

  const notify = useNotify()
  
  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return

    const found = validate(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setFormError('')
      return
    }

    setStatus('sending')
    setFormError('')

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          website: values.website,
        }),
      })

      if (res.status === 201) {
        setValues(EMPTY)
        setStatus('success')
        notify.success('Your message was sent.')
        return
      }

      const data = await res.json().catch(() => ({}))
      if (res.status === 400 && data.fields) {
        setErrors(data.fields)
      }
      setFormError(data.error || 'Something went wrong. Please try again.')
      setStatus('error')
      notify.error(data.error || 'Something went wrong. Please try again.')
    } catch {
      setFormError('Could not reach the server. Please try again in a moment.')
      setStatus('error')
      notify.error('Could not reach the server. Please try again in a moment.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ maxWidth: 640 }}>
        <SectionHeader title="Contact" />
        <Card>
          <div role="status">
            <h3 style={{ marginTop: 0, color: 'var(--color-success)' }}>Message sent</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Thanks for reaching out. I will get back to you soon.
            </p>
            <Button variant="secondary" onClick={() => setStatus('idle')}>
              Send another message
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <div style={{ maxWidth: 640 }}>
      <SectionHeader
        title="Contact"
        subtitle="Have a project or opportunity in mind? Send me a message."
      />

      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <Field id="name" label="Name" error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={LIMITS.name}
              value={values.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              style={inputStyle(errors.name)}
            />
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              style={inputStyle(errors.email)}
            />
          </Field>

          <Field id="message" label="Message" error={errors.message}>
            <textarea
              id="message"
              name="message"
              rows={6}
              maxLength={LIMITS.message}
              value={values.message}
              onChange={handleChange}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
              style={{ ...inputStyle(errors.message), resize: 'vertical' }}
            />
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
              {values.message.length} / {LIMITS.message}
            </p>
          </Field>

          {/* Honeypot: hidden from people, visible to bots that fill every field */}
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          {formError && (
            <p role="alert" style={{ color: 'var(--color-danger)', marginTop: 0 }}>
              {formError}
            </p>
          )}

          <Button
            type="submit"
            disabled={sending}
            style={{ opacity: sending ? 0.7 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
          >
            {sending ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

function Field({ id, label, error, children }) {
  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <label
        htmlFor={id}
        style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem', fontWeight: 500 }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--color-danger)' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

function inputStyle(hasError) {
  return {
    width: '100%',
    padding: '0.65rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${hasError ? 'var(--color-danger)' : 'var(--color-border)'}`,
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
  }
}