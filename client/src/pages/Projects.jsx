import { Link, useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch.js'
import Card from '../components/ui/Card.jsx'
import TagChip from '../components/ui/TagChip.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

const ALL_TECHNOLOGIES = ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker']

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTech = searchParams.get('tech') || ''
  const search = searchParams.get('search') || ''

  const query = new URLSearchParams()
  if (activeTech) query.set('tech', activeTech)
  if (search) query.set('search', search)

  const { data: projects, error, loading, retry } = useFetch(`/api/projects?${query.toString()}`)

  function setTech(tech) {
    const next = new URLSearchParams(searchParams)
    if (tech) {
      next.set('tech', tech)
    } else {
      next.delete('tech')
    }
    setSearchParams(next)
  }

  function setSearch(value) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set('search', value)
    } else {
      next.delete('search')
    }
    setSearchParams(next)
  }

  return (
    <div>
      <SectionHeader title="Projects" subtitle="Filter by technology or search by name." />

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '0.95rem',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
        <FilterChip label="All" active={!activeTech} onClick={() => setTech('')} />
        {ALL_TECHNOLOGIES.map((tech) => (
          <FilterChip key={tech} label={tech} active={activeTech === tech} onClick={() => setTech(tech)} />
        ))}
      </div>

      {loading && <LoadingState label="Loading projects..." />}
      {error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && projects?.length === 0 && (
        <EmptyState title="No projects match" message="Try a different filter or search term." />
      )}

      {projects?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-md)' }}>
          {projects.map((project) => (
            <Card key={project.id} className="card-hover">
              <h3 style={{ marginTop: 0 }}>
                <Link to={`/projects/${project.slug}`} style={{ color: 'var(--color-text)' }}>
                  {project.title}
                </Link>
              </h3>
              <p style={{ color: 'var(--color-text-muted)' }}>{project.summary}</p>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {project.tech.split(', ').filter(Boolean).map((tech) => (
                  <TagChip key={tech}>{tech}</TagChip>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.4rem 0.9rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--color-border)',
        background: active ? 'var(--color-accent)' : 'var(--color-surface)',
        color: active ? '#fff' : 'var(--color-text-muted)',
        fontSize: '0.85rem',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}