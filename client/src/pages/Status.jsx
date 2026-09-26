import { useFetch } from '../hooks/useFetch.js'
import Card from '../components/ui/Card.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'

export default function Status() {
  const { data, error, loading, retry } = useFetch('/api/health')

  return (
    <div>
      <SectionHeader title="Status" subtitle="Live health of the API and database." />

      <Card>
        {loading && <LoadingState label="Checking API status..." />}
        {error && <ErrorState message={error} onRetry={retry} />}
        {data && (
          <div>
            <p style={{ margin: 0 }}>
              <strong>Status:</strong> {data.status}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Database:</strong> {data.database}
            </p>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
              Uptime: {Math.round(data.uptime)}s
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}