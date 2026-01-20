import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './LandingPage';
import Login from './auth/Login';
import Signup from './auth/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Inventory from './pages/admin/Inventory';
import JobManagement from './pages/admin/JobManagement';
import Billing from './pages/admin/Billing';

// Mechanic Pages
import MechanicDashboard from './pages/mechanic/MechanicDashboard';
import InventoryManagement from './pages/mechanic/InventoryManagement';

// Customer Pages
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import ServiceRequest from './pages/Customer/ServiceRequest';
import ServiceHistory from './pages/Customer/ServiceHistory';
import MyVehicles from './pages/Customer/MyVehicles';

import ProtectedRoute from './components/ProtectedRoute';

// Home Route Component - Shows landing page or redirects to dashboard
const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to their dashboard
  if (user) {
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'MECHANIC':
        return <Navigate to="/mechanic/dashboard" replace />;
      case 'CUSTOMER':
        return <Navigate to="/customer/dashboard" replace />;
      default:
        return <LandingPage />;
    }
  }

  // If not logged in, show landing page
  return <LandingPage />;
};

// Smart Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'MECHANIC':
      return <Navigate to="/mechanic/dashboard" replace />;
    case 'CUSTOMER':
      return <Navigate to="/customer/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// 404 Not Found Page
const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Smart Dashboard Route - Redirects to role-specific dashboard */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/jobs" element={<JobManagement />} />
            <Route path="/admin/billing" element={<Billing />} />
          </Route>

          {/* Protected Mechanic Routes */}
          <Route element={<ProtectedRoute allowedRoles={['MECHANIC']} />}>
            <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
            <Route path="/mechanic/inventory" element={<InventoryManagement />} />
          </Route>

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/request-service" element={<ServiceRequest />} />
            <Route path="/customer/history" element={<ServiceHistory />} />
            <Route path="/customer/vehicles" element={<MyVehicles />} />
          </Route>

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
