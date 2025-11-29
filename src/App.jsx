import { useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from './components/wrapper/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import News from './pages/news/News';
import Events from './pages/events/Events';
import Projects from './pages/projects/Projects';
import Users from './pages/users/Users';


function App() {
  const { isAdmin } = useAuth();

  return (
    <ThemeProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element={isAdmin ? <Navigate to="/" /> : <Login />} />

            {/* protected pages */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App
