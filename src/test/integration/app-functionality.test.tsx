import { describe, it, expect } from 'vitest';
import { config } from '../../config/environment';

describe('App Integration Tests', () => {
  it('should have all required environment variables configured', () => {
    // Firebase config
    expect(config.firebase.apiKey).toBeTruthy();
    expect(config.firebase.authDomain).toBeTruthy();
    expect(config.firebase.projectId).toBeTruthy();
    expect(config.firebase.storageBucket).toBeTruthy();
    expect(config.firebase.messagingSenderId).toBeTruthy();
    expect(config.firebase.appId).toBeTruthy();
    
    // Gemini config
    expect(config.gemini.apiKey).toBeTruthy();
    
    // App config
    expect(config.app.name).toBe('THEFMSMKT POS System');
    expect(config.app.version).toBeTruthy();
  });

  it('should have correct Firebase project configuration', () => {
    expect(config.firebase.projectId).toBe('thefmsmkt-kiosk-runcit-veteran');
    expect(config.firebase.authDomain).toBe('thefmsmkt-kiosk-runcit-veteran.firebaseapp.com');
  });

  it('should have proper app environment setup', () => {
    expect(['development', 'staging', 'production']).toContain(config.app.environment);
  });
});
