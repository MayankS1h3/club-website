import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-100">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<div className="p-8"><h1 className="text-3xl font-bold text-purple-600">Welcome to Club Website</h1></div>} />
            
            {/* Admin login */}
            <Route path="/admin" element={<AdminLogin />} />
            
            {/* Protected admin routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              } 
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/new" element={<div className="p-8"><h1 className="text-2xl font-bold">Create Event (Coming Soon)</h1></div>} />
              <Route path="events/:id/edit" element={<div className="p-8"><h1 className="text-2xl font-bold">Edit Event (Coming Soon)</h1></div>} />
              <Route path="gallery" element={<div className="p-8"><h1 className="text-2xl font-bold">Gallery Management (Coming Soon)</h1></div>} />
              <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings (Coming Soon)</h1></div>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
