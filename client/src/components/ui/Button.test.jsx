import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button.jsx'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Save</Button>)

    fireEvent.click(screen.getByText('Save'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Save</Button>)

    fireEvent.click(screen.getByText('Save'))

    expect(handleClick).not.toHaveBeenCalled()
  })
})