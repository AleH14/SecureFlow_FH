import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

describe('Home Page', () => {
  it('renders homepage without crashing', () => {
    render(<Home />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays the main content', () => {
    render(<Home />)
    expect(screen.getByText(/get started by editing/i)).toBeInTheDocument()
  })

  it('has the correct page structure', () => {
    render(<Home />)
    const main = screen.getByRole('main')
    expect(main).toHaveClass('page')
  })
})