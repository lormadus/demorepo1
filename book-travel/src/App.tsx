import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import RegisterBookPage from './pages/RegisterBookPage';
import HandoffPage from './pages/HandoffPage';
import ReceiveBookPage from './pages/ReceiveBookPage';
import MyBooksPage from './pages/MyBooksPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/book/:id" element={<ProtectedRoute><BookDetailPage /></ProtectedRoute>} />
      <Route path="/register" element={<ProtectedRoute><RegisterBookPage /></ProtectedRoute>} />
      <Route path="/handoff/:id" element={<ProtectedRoute><HandoffPage /></ProtectedRoute>} />
      <Route path="/receive" element={<ProtectedRoute><ReceiveBookPage /></ProtectedRoute>} />
      <Route path="/my-books" element={<ProtectedRoute><MyBooksPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="max-w-md mx-auto min-h-screen bg-[#FAFAFA]">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
