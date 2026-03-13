import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import Menu from './pages/Menu'
import DishDetail from './pages/DishDetail'
import Specials from './pages/Specials'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDishForm from './pages/admin/AdminDishForm'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--navbar-h)' }}>
        {children}
      </div>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/menu" element={<PublicLayout><Menu /></PublicLayout>} />
          <Route path="/dish/:id" element={<PublicLayout><DishDetail /></PublicLayout>} />
          <Route path="/specials" element={<PublicLayout><Specials /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin routes — no Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/dishes/new" element={
            <ProtectedRoute><AdminDishForm /></ProtectedRoute>
          } />
          <Route path="/admin/dishes/:id/edit" element={
            <ProtectedRoute><AdminDishForm /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
