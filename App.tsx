
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './pages/LoginScreen';
import MainAppLayout from './components/layout/MainAppLayout';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POS/POSPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import CRMPage from './pages/CRM/CRMPage';
import EmployeePage from './pages/Employee/EmployeePage';
import ReportsPage from './pages/Reports/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import VisionCheckoutPage from './pages/VisionCheckout/VisionCheckoutPage';
import VisionStockInPage from './pages/Inventory/VisionStockInPage';
import InventoryMonitoringPage from './pages/Inventory/InventoryMonitoringPage';
import ProductSetPage from './pages/ProductSet/ProductSetPage'; // Added Product Set Page
import Toast from './components/common/Toast';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toast />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginScreen />} />
    <Route path="/" element={isAuthenticated ? <MainAppLayout /> : <Navigate to="/login" />}>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="pos" element={<POSPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="inventory/vision-stock-in" element={<VisionStockInPage />} />
      <Route path="inventory/monitoring" element={<InventoryMonitoringPage />} />
      <Route path="product-sets" element={<ProductSetPage />} /> {/* Added Product Set Route */}
      <Route path="crm" element={<CRMPage />} />
      <Route path="employees" element={<EmployeePage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="vision-checkout" element={<VisionCheckoutPage />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
};

export default App;
