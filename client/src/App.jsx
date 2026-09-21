import { useEffect, useState } from 'react'

export default function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main style={{ fontFamily: 'monospace', padding: '2rem' }}>
      <h1>// portfolio</h1>
      <h2>API status</h2>

      {error && <p>Could not reach the API: {error}</p>}
      {!health && !error && <p>Loading...</p>}
      {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
    </main>
  )
}