import React from 'react';
import { useAppSelector } from './store/hooks';
import Login from './components/Login';
import AccountCRUD from './components/AccountCRUD';
import './App.css';

function App() {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <div className="App">
      {isAuthenticated ? <AccountCRUD /> : <Login />}
    </div>
  );
}

export default App;