export async function fetchCsrfToken() {
  const res = await fetch('/api/auth/csrf-token', { credentials: 'same-origin' })
  if (!res.ok) throw new Error('Could not prepare a secure session')
  const data = await res.json()
  return data.csrfToken
}