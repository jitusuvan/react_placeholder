import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { getProfile } from './store/authSlice';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DarkModeProvider } from './context/DarkModeContext';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <DarkModeProvider>
      <ErrorBoundary>
        <Router>
          {isAuthenticated && <Navigation />}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/attendance" element={isAuthenticated ? <AttendancePage /> : <Navigate to="/login" replace />} />
            <Route path="/leave" element={isAuthenticated ? <LeavePage /> : <Navigate to="/login" replace />} />
            <Route path="/holidays" element={isAuthenticated ? <HolidayPage /> : <Navigate to="/login" replace />} />
            <Route path="/work" element={isAuthenticated ? <ProjectWorkPage /> : <Navigate to="/login" replace />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/attendance" : "/login"} replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </DarkModeProvider>
  );
}

const LoginPage = React.lazy(() => import('./components/LoginPage').then(m => ({ default: m.default })));
const RegisterPage = React.lazy(() => import('./components/RegisterPage').then(m => ({ default: m.default })));
const AttendancePage = React.lazy(() => import('./components/AttendancePage').then(m => ({ default: m.default })));
const LeavePage = React.lazy(() => import('./components/LeavePage').then(m => ({ default: m.default })));
const HolidayPage = React.lazy(() => import('./components/HolidayPage').then(m => ({ default: m.default })));
const ProjectWorkPage = React.lazy(() => import('./components/ProjectWorkPage').then(m => ({ default: m.default })));

export default App
