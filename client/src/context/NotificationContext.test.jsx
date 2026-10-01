import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NotificationProvider, useNotify } from './NotificationContext.jsx'

function TestButtons() {
  const notify = useNotify()
  return (
    <div>
      <button onClick={() => notify.success('Saved successfully')}>trigger-success</button>
      <button onClick={() => notify.error('Something broke')}>trigger-error</button>
    </div>
  )
}

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a success toast when triggered', () => {
    render(
      <NotificationProvider>
        <TestButtons />
      </NotificationProvider>
    )

    fireEvent.click(screen.getByText('trigger-success'))

    expect(screen.getByText('Saved successfully')).toBeInTheDocument()
  })

  it('auto-dismisses a toast after its duration', () => {
    render(
      <NotificationProvider>
        <TestButtons />
      </NotificationProvider>
    )

    fireEvent.click(screen.getByText('trigger-success'))
    expect(screen.getByText('Saved successfully')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument()
  })

  it('can be dismissed manually before the timer finishes', () => {
    render(
      <NotificationProvider>
        <TestButtons />
      </NotificationProvider>
    )

    fireEvent.click(screen.getByText('trigger-error'))
    expect(screen.getByText('Something broke')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Dismiss notification'))
    expect(screen.queryByText('Something broke')).not.toBeInTheDocument()
  })
})