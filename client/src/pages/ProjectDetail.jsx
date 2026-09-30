import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch.js'
import Card from '../components/ui/Card.jsx'
import TagChip from '../components/ui/TagChip.jsx'
import Button from '../components/ui/Button.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function ProjectDetail() {
  usePageTitle(project?.title)
  const { slug } = useParams()
  const { data: project, error, loading, retry } = useFetch(`/api/projects/${slug}`)

  return (
    <div>
      <Link
        to="/projects"
        style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'inline-block', marginBottom: 'var(--space-md)' }}
      >
        ← Back to projects
      </Link>

      {loading && <LoadingState label="Loading project..." />}
      {error && <ErrorState message={error} onRetry={retry} />}

      {project && (
        <div>
          <h1 style={{ marginBottom: 'var(--space-xs)' }}>{project.title}</h1>

          <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
            {project.tech.split(', ').filter(Boolean).map((tech) => (
              <TagChip key={tech}>{tech}</TagChip>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            {project.repo_url && (
              <Button as="a" href={project.repo_url} target="_blank" rel="noopener noreferrer" variant="secondary">
                GitHub
              </Button>
            )}
            {project.live_url && (
              <Button as="a" href={project.live_url} target="_blank" rel="noopener noreferrer">
                Live site
              </Button>
            )}
          </div>

          <Card>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>{project.summary}</p>
            {project.description && (
              <p style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}