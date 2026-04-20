import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminHome from './pages/AdminHome'
import EmpHome from './pages/EmpHome'
import BinDetail from './pages/BinDetail'
import BinRecord from './pages/BinRecord'

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/home' : '/emp/home'} replace />
  }
  return children
}

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Login />
  return <Navigate to={user.role === 'admin' ? '/admin/home' : '/emp/home'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/admin/home" element={
            <ProtectedRoute allowedRole="admin"><AdminHome /></ProtectedRoute>
          } />
          <Route path="/emp/home" element={
            <ProtectedRoute allowedRole="emp"><EmpHome /></ProtectedRoute>
          } />
          <Route path="/bins/:id" element={
            <ProtectedRoute><BinDetail /></ProtectedRoute>
          } />
          <Route path="/bins/:id/record" element={
            <ProtectedRoute allowedRole="emp"><BinRecord /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}