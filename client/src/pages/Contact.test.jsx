import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NotificationProvider } from '../context/NotificationContext.jsx'
import Contact from './Contact.jsx'

function renderWithProviders(ui) {
  return render(<NotificationProvider>{ui}</NotificationProvider>)
}

describe('Contact form', () => {
  it('shows validation errors when submitted empty', () => {
    renderWithProviders(<Contact />)

    fireEvent.click(screen.getByText('Send message'))

    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/valid email address is required/i)).toBeInTheDocument()
    expect(screen.getByText(/message must be between/i)).toBeInTheDocument()
  })

  it('clears a field error once the user starts typing', () => {
    renderWithProviders(<Contact />)

    fireEvent.click(screen.getByText('Send message'))
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Lance' } })
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
  })
})