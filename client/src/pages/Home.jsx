import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import TagChip from '../components/ui/TagChip.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'

export default function Home() {
  return (
    <div>
      <SectionHeader
        title="Full-stack developer"
        subtitle="Building reliable web apps with React, Node.js, and PostgreSQL."
      />

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        <Button as={Link} to="/projects">View Projects</Button>
        <Button as={Link} to="/contact" variant="secondary">Contact</Button>
      </div>

      <Card>
        <h3 style={{ marginTop: 0 }}>Full-Stack Portfolio</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>
          This site. A portfolio that is itself a working full-stack app.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
          <TagChip>React</TagChip>
          <TagChip>Node.js</TagChip>
          <TagChip>Express</TagChip>
          <TagChip>PostgreSQL</TagChip>
          <TagChip>Docker</TagChip>
        </div>
      </Card>
    </div>
  )
}