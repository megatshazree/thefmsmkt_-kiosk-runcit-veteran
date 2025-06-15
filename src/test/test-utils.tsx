import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Mock providers for testing
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => children
const MockLanguageProvider = ({ children }: { children: React.ReactNode }) => children  
const MockToastProvider = ({ children }: { children: React.ReactNode }) => children
const MockCartProvider = ({ children }: { children: React.ReactNode }) => children
const MockNavigationProvider = ({ children }: { children: React.ReactNode }) => children

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <MockAuthProvider>
        <MockLanguageProvider>
          <MockToastProvider>
            <MockNavigationProvider>
              <MockCartProvider>
                {children}
              </MockCartProvider>
            </MockNavigationProvider>
          </MockToastProvider>
        </MockLanguageProvider>
      </MockAuthProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Common test data
export const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 10.99,
  category: 'Test Category',
  image: '🧪',
  stock: 50,
  sku: 'TEST-001',
}

export const mockCustomer = {
  id: '1',
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '123-456-7890',
  totalSpent: 100.50,
}

export const mockEmployee = {
  id: '1',
  fullname: 'Test Employee',
  email: 'employee@example.com',
  phone: '123-456-7890',
  department: 'Sales',
  role: 'cashier',
  pin: '1234',
  startDate: '2024-01-01',
  status: 'Aktif' as const,
  permissions: {
    fullAccess: false,
    manualDiscount: true,
    processRefund: false,
  },
}

// Mock user for authentication tests
export const mockAuthUser = {
  uid: 'test-uid',
  email: 'admin@example.com',
  displayName: 'Test Admin',
}

// Helper to create mock cart items
export const createMockCartItem = (overrides = {}) => ({
  ...mockProduct,
  quantity: 1,
  ...overrides,
})

// Helper to wait for async operations
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

// Custom matcher for testing CSS classes
export const hasClass = (element: Element, className: string) => 
  element.classList.contains(className)

// Helper to simulate user typing
export const typeIntoElement = async (
  element: HTMLElement, 
  text: string,
  userEvent: any
) => {
  await userEvent.clear(element)
  await userEvent.type(element, text)
}
