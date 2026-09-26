import Button from './Button.jsx'

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-xl) var(--space-md)',
      }}
    >
      <p style={{ color: 'var(--color-text)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}