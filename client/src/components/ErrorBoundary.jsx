import { Component } from 'react'
import Card from './ui/Card.jsx'
import Button from './ui/Button.jsx'
import SectionHeader from './ui/SectionHeader.jsx'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Logged for you to see during development; nothing sensitive reaches the UI
    console.error('Caught by ErrorBoundary:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: 480, margin: 'var(--space-xl) auto', textAlign: 'center' }}>
          <SectionHeader title="Something went wrong" />
          <Card>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>
              This part of the page ran into a problem. You can try again, or head back home.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center' }}>
              <Button onClick={this.handleReset}>Try again</Button>
              <Button variant="secondary" as="a" href="/">
                Go home
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}