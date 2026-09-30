import { useFetch } from '../hooks/useFetch.js'
import Card from '../components/ui/Card.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function About() {
  usePageTitle('About')
  const { data: skills, error: skillsError, loading: skillsLoading, retry: retrySkills } = useFetch('/api/skills')
  const { data: experience, error: expError, loading: expLoading, retry: retryExp } = useFetch('/api/experience')

  const skillsByCategory = groupByCategory(skills)

  return (
    <div>
      <SectionHeader
        title="About"
        subtitle="Bookkeeping & Executive Virtual Assistant, now building full-stack web apps."
      />

      <AboutIntro />

      <SectionHeader title="Skills" />
      {skillsLoading && <LoadingState label="Loading skills..." />}
      {skillsError && <ErrorState message={skillsError} onRetry={retrySkills} />}
      {skillsByCategory && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          {Object.entries(skillsByCategory).map(([category, items]) => (
            <Card key={category}>
              <h4 style={{ marginTop: 0, color: 'var(--color-accent)' }}>{category}</h4>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)' }}>
                {items.map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <SectionHeader title="Experience" />
      {expLoading && <LoadingState label="Loading experience..." />}
      {expError && <ErrorState message={expError} onRetry={retryExp} />}
      {experience && (
        <div>
          {experience.map((item) => (
            <Card key={item.id} style={{ marginBottom: 'var(--space-md)' }}>
              <h4 style={{ marginTop: 0, marginBottom: '0.2rem' }}>{item.title}</h4>
              <p style={{ margin: 0, color: 'var(--color-accent)', fontSize: '0.9rem' }}>
                {item.organization}
              </p>
              <p style={{ margin: '0.3rem 0 0.6rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                {formatDate(item.start_date)} to {item.end_date ? formatDate(item.end_date) : 'Present'}
              </p>
              <p style={{ margin: 0 }}>{item.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AboutIntro() {
  const { data, loading, error } = useFetch('/api/about')

  if (loading) return <LoadingState label="Loading..." />
  if (error) return null // fail quietly here, the rest of the page still works

  return (
    <Card style={{ marginBottom: 'var(--space-lg)' }}>
      <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{data?.intro}</p>
    </Card>
  )
}

function groupByCategory(skills) {
  if (!skills) return null
  return skills.reduce((groups, skill) => {
    const list = groups[skill.category] || []
    list.push(skill)
    groups[skill.category] = list
    return groups
  }, {})
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}