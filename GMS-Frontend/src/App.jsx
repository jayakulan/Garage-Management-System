import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './LandingPage';
import Login from './auth/Login';
import Signup from './auth/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MechanicDashboard from './pages/Mechanic/MechanicDashboard';
import CustomerDashboard from './pages/Customer/CustomerDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (Ideally wrapped in a PrivateRoute component) */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
