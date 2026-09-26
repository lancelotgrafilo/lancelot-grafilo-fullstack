import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch.js'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import TagChip from '../components/ui/TagChip.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function Home() {
  const { data: projects, error, loading, retry } = useFetch('/api/projects')

  const featured = projects?.filter((p) => p.featured) ?? []

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <Avatar src="/headshot.png" alt="Lancelot Grafilo" initials="LG" size={110} />
        <SectionHeader
          title="Full-stack developer"
          subtitle="Building reliable web apps with React, Node.js, and PostgreSQL."
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        <Button as={Link} to="/projects">View Projects</Button>
        <Button as={Link} to="/contact" variant="secondary">Contact</Button>
      </div>

      <SectionHeader title="Featured projects" />

      {loading && <LoadingState label="Loading projects..." />}
      {error && <ErrorState message={error} onRetry={retry} />}
      {!loading && !error && featured.length === 0 && (
        <EmptyState
          title="No featured projects yet"
          message="Check back soon, or view all projects."
        />
      )}

      {featured.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-md)' }}>
          {featured.map((project) => (
            <Card key={project.id}>
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