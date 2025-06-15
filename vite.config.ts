import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Runtime check for API key presence
  if (!env.VITE_GEMINI_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn('Warning: VITE_GEMINI_API_KEY is missing from environment variables. Some features may not work.');
  }

  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'Dashboard': path.resolve(__dirname, 'pages/DashboardPage.tsx'),
        'Sales': path.resolve(__dirname, 'pages/POS/POSPage.tsx'),
        'VisionAICheckout': path.resolve(__dirname, 'pages/VisionCheckout/VisionCheckoutPage.tsx'),
        'Inventory': path.resolve(__dirname, 'pages/Inventory/InventoryPage.tsx'),
        'StockInVisionAI': path.resolve(__dirname, 'pages/Inventory/VisionStockInPage.tsx'),
        'InventoryMonitoringAI': path.resolve(__dirname, 'pages/Inventory/InventoryMonitoringPage.tsx'),
        'ProductSets': path.resolve(__dirname, 'pages/ProductSet/ProductSetPage.tsx'),
        'Customers': path.resolve(__dirname, 'pages/CRM/CRMPage.tsx'),
        'Employees': path.resolve(__dirname, 'pages/Employee/EmployeePage.tsx'),
        'Reports': path.resolve(__dirname, 'pages/Reports/ReportsPage.tsx'),
        'Settings': path.resolve(__dirname, 'pages/SettingsPage.tsx'),
      }
    },
    build: {
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        // Suppress framer-motion "use client" warnings
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
          }
          warn(warning);
        },
        // Fix module initialization issues
        external: [],
        output: {
          // Simplified chunk splitting to avoid dependency issues
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
          }
        }
      }
    },
    // Optimize dependencies for faster dev server
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        '@heroicons/react'
      ]
    }
  };
});
