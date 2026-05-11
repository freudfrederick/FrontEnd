import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';
import { Login } from '../../pages/Login';
import { useAuthContext } from '../../contexts/AuthContext/useAuthContext';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }
  return <>{children}</>;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/history/' element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path='/settings/' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path='/about-pomodoro/' element={<ProtectedRoute><AboutPomodoro /></ProtectedRoute>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}
