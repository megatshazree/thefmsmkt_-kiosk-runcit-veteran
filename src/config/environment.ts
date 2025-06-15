// Environment configuration with validation
interface EnvironmentConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  gemini: {
    apiKey: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  monitoring: {
    sentryDsn?: string;
    analyticsId?: string;
  };
}

// Validation helper
const getRequiredEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    console.warn(`Warning: Required environment variable ${name} is not set`);
    return ''; // Return empty string instead of throwing
  }
  return value;
};

const getOptionalEnvVar = (name: string, defaultValue = ''): string => {
  return import.meta.env[name] || defaultValue;
};

// Environment configuration object
export const config: EnvironmentConfig = {
  firebase: {
    apiKey: getRequiredEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getRequiredEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getRequiredEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getRequiredEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getRequiredEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getRequiredEnvVar('VITE_FIREBASE_APP_ID'),
  },
  gemini: {
    apiKey: getRequiredEnvVar('VITE_GEMINI_API_KEY'),
  },
  app: {
    name: getOptionalEnvVar('VITE_APP_NAME', 'THEFMSMKT POS System'),
    version: getOptionalEnvVar('VITE_APP_VERSION', '1.0.0'),
    environment: getOptionalEnvVar('VITE_ENVIRONMENT', 'development') as 'development' | 'staging' | 'production',
  },
  monitoring: {
    sentryDsn: getOptionalEnvVar('VITE_SENTRY_DSN'),
    analyticsId: getOptionalEnvVar('VITE_ANALYTICS_ID'),
  },
};

// Validate environment on startup
export const validateEnvironment = (): void => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_GEMINI_API_KEY',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(', ')}\n` +
      'Some features may not work correctly. Please configure environment variables.'
    );
  } else {
    console.log(`🚀 Environment validated successfully (${config.app.environment})`);
  }
};

// Helper to check if we're in development
export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
export const isStaging = config.app.environment === 'staging';

// Export for backward compatibility
export default config;
