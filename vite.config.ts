import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Runtime check for API key presence
  if (!env.GEMINI_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn('Warning: GEMINI_API_KEY is missing from environment variables. Some features may not work.');
  }

  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
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
        output: {
          // More granular chunk splitting
          manualChunks: (id) => {
            // Node modules chunking
            if (id.includes('node_modules')) {
              // React ecosystem
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              
              // Router
              if (id.includes('react-router')) {
                return 'router';
              }
              
              // Framer Motion
              if (id.includes('framer-motion')) {
                return 'motion';
              }
              
              // Heroicons
              if (id.includes('@heroicons')) {
                return 'icons';
              }
              
              // Headless UI
              if (id.includes('@headlessui')) {
                return 'headless-ui';
              }
              
              // Other vendor libraries
              return 'vendor';
            }
            
            // Application code chunking by feature
            if (id.includes('/pages/')) {
              if (id.includes('/POS/')) {
                return 'pos-pages';
              }
              if (id.includes('/VisionCheckout/')) {
                return 'vision-pages';
              }
              if (id.includes('/Inventory/')) {
                return 'inventory-pages';
              }
              if (id.includes('/CRM/')) {
                return 'crm-pages';
              }
              if (id.includes('/Reports/')) {
                return 'reports-pages';
              }
              if (id.includes('/Employee/')) {
                return 'employee-pages';
              }
              if (id.includes('/ProductSet/')) {
                return 'productset-pages';
              }
              return 'other-pages';
            }
            
            // Components chunking
            if (id.includes('/components/')) {
              if (id.includes('/ui/')) {
                return 'ui-components';
              }
              return 'components';
            }
            
            // Contexts and hooks
            if (id.includes('/contexts/') || id.includes('/hooks/')) {
              return 'app-logic';
            }
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
