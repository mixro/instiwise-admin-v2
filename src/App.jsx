import { useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from './components/wrapper/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import { ThemeProvider } from './context/ThemeContext';


function App() {
  const isAdmin = false;

  return (
    <ThemeProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element={isAdmin ? <Navigate to="/" /> : <Login />} />

            {/* protected pages */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App
