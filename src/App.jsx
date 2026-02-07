import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { ProtectedRoute } from './components/auth';
import { ToastContainer } from './components/ui';
import { useAuthStore } from './store';

// Pages
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/inventory/InventoryList';
import ItemDetail from './pages/inventory/ItemDetail';
import Categories from './pages/inventory/Categories';
import Locations from './pages/inventory/Locations';
import Inbound from './pages/transactions/Inbound';
import Outbound from './pages/transactions/Outbound';
import Requests from './pages/transactions/Requests';
import UserList from './pages/users/UserList';
import Settings from './pages/Settings';
import StockOpname from './pages/StockOpname';
import Reports from './pages/Reports';
import Login from './pages/auth/Login';

import './index.css';

// Guest Route - redirect to dashboard if already logged in
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Inventory */}
          <Route path="inventory" element={<InventoryList />} />
          <Route path="inventory/:id" element={<ItemDetail />} />
          <Route path="inventory/categories" element={<Categories />} />
          <Route path="inventory/locations" element={<Locations />} />

          {/* Transactions - Staff & Admin only */}
          <Route
            path="transactions"
            element={
              <ProtectedRoute requiredRole="staff">
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="transactions/inbound"
            element={
              <ProtectedRoute requiredRole="staff">
                <Inbound />
              </ProtectedRoute>
            }
          />
          <Route
            path="transactions/outbound"
            element={
              <ProtectedRoute requiredRole="staff">
                <Outbound />
              </ProtectedRoute>
            }
          />
          <Route
            path="transactions/requests"
            element={
              <ProtectedRoute requiredRole="staff">
                <Requests />
              </ProtectedRoute>
            }
          />

          {/* Stock Opname - Admin only */}
          <Route
            path="stock-opname"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <StockOpname />
              </ProtectedRoute>
            }
          />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Users - Admin only */}
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <UserList />
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
