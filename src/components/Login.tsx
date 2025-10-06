import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, register } from '../store/authSlice';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isRegister) {
      dispatch(register(formData));
      setIsRegister(false);
      alert('Account created! Please login.');
    } else {
      const users = JSON.parse(sessionStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.username === formData.username && u.password === formData.password);
      
      if (user) {
        dispatch(login(formData));
      } else {
        setError('Invalid credentials');
      }
    }
    setFormData({ username: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? 'Create Account' : 'Login'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
          )}
          
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>
        
        <p className="text-center mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 ml-2 hover:underline"
          >
            {isRegister ? 'Login' : 'Create Account'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;