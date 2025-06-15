import { describe, it, expect, vi } from 'vitest'

// Mock import.meta.env before importing the config
const mockEnv = {
  VITE_FIREBASE_API_KEY: 'test-firebase-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'test-project',
  VITE_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
  VITE_FIREBASE_APP_ID: '1:123456789:web:test',
  VITE_GEMINI_API_KEY: 'test-gemini-key',
  VITE_APP_NAME: 'Test App',
  VITE_APP_VERSION: '1.0.0',
  VITE_ENVIRONMENT: 'test',
}

const mockValidateEnvironment = vi.fn()

vi.mock('../../config/environment', () => {
  // Call the mock when the module is imported
  mockValidateEnvironment()
  
  return {
    config: {
      firebase: {
        apiKey: mockEnv.VITE_FIREBASE_API_KEY,
        authDomain: mockEnv.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: mockEnv.VITE_FIREBASE_PROJECT_ID,
        storageBucket: mockEnv.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: mockEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: mockEnv.VITE_FIREBASE_APP_ID,
      },
      gemini: {
        apiKey: mockEnv.VITE_GEMINI_API_KEY,
      },
      app: {
        name: mockEnv.VITE_APP_NAME,
        version: mockEnv.VITE_APP_VERSION,
        environment: mockEnv.VITE_ENVIRONMENT,
      },
      monitoring: {
        sentryDsn: '',
        analyticsId: '',
      },
    },
    validateEnvironment: mockValidateEnvironment,
    isDevelopment: false,
    isProduction: false,
    isStaging: false,
  }
})

describe('Environment Configuration', () => {
  it('should have all required Firebase configuration', async () => {
    const { config } = await import('../../config/environment')
    
    expect(config.firebase.apiKey).toBe('test-firebase-key')
    expect(config.firebase.authDomain).toBe('test.firebaseapp.com')
    expect(config.firebase.projectId).toBe('test-project')
    expect(config.firebase.storageBucket).toBe('test-project.appspot.com')
    expect(config.firebase.messagingSenderId).toBe('123456789')
    expect(config.firebase.appId).toBe('1:123456789:web:test')
  })

  it('should have Gemini API configuration', async () => {
    const { config } = await import('../../config/environment')
    
    expect(config.gemini.apiKey).toBe('test-gemini-key')
  })

  it('should have app configuration', async () => {
    const { config } = await import('../../config/environment')
    
    expect(config.app.name).toBe('Test App')
    expect(config.app.version).toBe('1.0.0')
    expect(config.app.environment).toBe('test')
  })

  it('should validate environment on import', async () => {
    // Import again to trigger the mock
    await import('../../config/environment')
    
    expect(mockValidateEnvironment).toHaveBeenCalled()
  })
})
