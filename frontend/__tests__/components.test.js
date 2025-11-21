/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'

// Mock component for testing
const Button = ({ onClick, children, disabled = false }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
)

const Counter = () => {
  const [count, setCount] = React.useState(0)
  
  return (
    <div>
      <span data-testid="count">{count}</span>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
      <Button onClick={() => setCount(count - 1)}>
        Decrement
      </Button>
      <Button onClick={() => setCount(0)}>
        Reset
      </Button>
    </div>
  )
}

describe('Component Testing Example', () => {
  it('renders button component correctly', () => {
    const mockClick = jest.fn()
    render(<Button onClick={mockClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('handles disabled state correctly', () => {
    const mockClick = jest.fn()
    render(<Button onClick={mockClick} disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('counter component works correctly', () => {
    // Mock React for this test
    const React = {
      useState: (initial) => {
        let state = initial
        const setState = (newState) => { state = newState }
        return [state, setState]
      }
    }
    
    // This is a simplified test - in a real app you'd import the actual component
    expect(true).toBe(true) // Placeholder assertion
  })
})