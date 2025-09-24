import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/common/Login'
import Signup from './components/common/Signup'
import TodoPage from './components/todo/TodoPage'
import TableDemo from './components/common/TableDemo'
import CustomForm from './components/common/CustomForm'
import PrivateRoute from './routes/PrivateRoute'

function App() {
  return (
    <Router>
      <div className="flex items-center justify-center min-h-screen app bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/todos" element={<TodoPage />} />
            <Route path="/table-demo" element={<TableDemo />} />
            <Route path="/custom-form" element={<CustomForm />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
