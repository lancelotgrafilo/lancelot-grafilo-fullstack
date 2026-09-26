import { useState } from 'react'

export default function Avatar({ src, alt, initials, size = 120 }) {
  const [failed, setFailed] = useState(false)

  const wrapperStyle = {
    width: size,
    height: size,
    borderRadius: 'var(--radius-full)',
    border: '2px solid var(--color-accent)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-surface)',
    flexShrink: 0,
  }

  if (!src || failed) {
    return (
      <div style={wrapperStyle}>
        <span style={{ fontSize: size * 0.35, fontWeight: 600, color: 'var(--color-accent)' }}>
          {initials}
        </span>
      </div>
    )
  }

  return (
    <div style={wrapperStyle}>
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}