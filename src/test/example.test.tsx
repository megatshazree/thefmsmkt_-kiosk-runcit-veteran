import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from './test-utils'
import { mockProduct } from './test-utils'

// Simple example test to verify setup
describe('Test Setup Verification', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello, Test!</div>
    
    render(<TestComponent />)
    
    expect(screen.getByText('Hello, Test!')).toBeInTheDocument()
  })

  it('should have access to mock data', () => {
    expect(mockProduct).toBeDefined()
    expect(mockProduct.name).toBe('Test Product')
    expect(mockProduct.price).toBe(10.99)
  })

  it('should be able to test async operations', async () => {
    const AsyncComponent = () => {
      const [data, setData] = React.useState('Loading...')
      
      React.useEffect(() => {
        setTimeout(() => setData('Loaded!'), 100)
      }, [])
      
      return <div>{data}</div>
    }
    
    render(<AsyncComponent />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    await screen.findByText('Loaded!')
    expect(screen.getByText('Loaded!')).toBeInTheDocument()
  })
})
