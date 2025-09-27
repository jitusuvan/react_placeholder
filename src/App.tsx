import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { getProfile } from './store/authSlice';
import { AuthContainer } from './components/AuthContainer';
import { TaskDashboard } from './components/TaskDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DarkModeProvider } from './context/DarkModeContext';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  // Temporary: Use SimpleAuth for testing
  const useSimpleAuth = true;

  const content = useSimpleAuth ? (
    localStorage.getItem('access_token') ? <TaskDashboard /> : <React.Suspense fallback={<div>Loading...</div>}><SimpleAuth /></React.Suspense>
  ) : (
    !isAuthenticated ? <AuthContainer /> : <TaskDashboard />
  );

  return (
    <DarkModeProvider>
      <ErrorBoundary>
        {content}
      </ErrorBoundary>
    </DarkModeProvider>
  );
}

const SimpleAuth = React.lazy(() => import('./components/SimpleAuth').then(m => ({ default: m.SimpleAuth })));

export default App
