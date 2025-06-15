import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ThemeProvider } from './src/contexts/ThemeContext';
import LoginScreen from './pages/LoginScreen';
import MainAppLayout from './components/layout/MainAppLayout';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POS/POSPage';
import CosyPOSPage from './pages/POS/CosyPOSPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import CRMPage from './pages/CRM/CRMPage';
import EmployeePage from './pages/Employee/EmployeePage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ThemeSettingsPage from './pages/Settings/ThemeSettingsPage';
import VisionCheckoutPage from './pages/VisionCheckout/VisionCheckoutPage';
import VisionStockInPage from './pages/Inventory/VisionStockInPage';
import InventoryMonitoringPage from './pages/Inventory/InventoryMonitoringPage';
import ProductSetPage from './pages/ProductSet/ProductSetPage'; // Added Product Set Page
import Toast from './components/common/Toast';
import ErrorBoundary from './src/components/common/ErrorBoundary';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Toast />
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginScreen />} />
          <Route path="/cosy-pos" element={<CosyPOSPage />} />
          <Route path="/" element={isAuthenticated ? <MainAppLayout /> : <Navigate to="/login" />}>
            <Route path="dashboard" element={
              <ErrorBoundary>
                <DashboardPage />
              </ErrorBoundary>
            } />
            <Route path="pos" element={
              <ErrorBoundary>
                <POSPage />
              </ErrorBoundary>
            } />
            <Route path="inventory" element={
              <ErrorBoundary>
                <InventoryPage />
              </ErrorBoundary>
            } />
            <Route path="inventory/vision-stock-in" element={
              <ErrorBoundary>
                <VisionStockInPage />
              </ErrorBoundary>
            } />
            <Route path="inventory/monitoring" element={
              <ErrorBoundary>
                <InventoryMonitoringPage />
              </ErrorBoundary>
            } />
            <Route path="product-sets" element={
              <ErrorBoundary>
                <ProductSetPage />
              </ErrorBoundary>
            } />
            <Route path="crm" element={
              <ErrorBoundary>
                <CRMPage />
              </ErrorBoundary>
            } />
            <Route path="employees" element={
              <ErrorBoundary>
                <EmployeePage />
              </ErrorBoundary>
            } />
            <Route path="reports" element={
              <ErrorBoundary>
                <ReportsPage />
              </ErrorBoundary>
            } />
            <Route path="settings" element={
              <ErrorBoundary>
                <SettingsPage />
              </ErrorBoundary>
            } />
            <Route path="settings/theme" element={
              <ErrorBoundary>
                <ThemeSettingsPage />
              </ErrorBoundary>
            } />
            <Route path="vision-checkout" element={
              <ErrorBoundary>
                <VisionCheckoutPage />
              </ErrorBoundary>
            } />
            <Route index element={<Navigate to="/dashboard" />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
