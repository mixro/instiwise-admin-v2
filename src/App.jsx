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
import NewsDetails from './pages/newsDetails/NewsDetails';
import Event from './pages/event/Event';
import Project from './pages/project/Project';
import User from './pages/user/User';
import NewUser from './pages/newUser/NewUser';
import NewEvent from './pages/newEvent/NewEvent';
import CreateNews from './pages/createNews/CreateNews';
import Requests from './pages/requests/Requests';
import Request from './pages/request/Request';


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
            <Route path="/news/:id" element={<ProtectedRoute><NewsDetails /></ProtectedRoute>} />
            <Route path="/create-news" element={<ProtectedRoute><CreateNews /></ProtectedRoute>} />

            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><Event /></ProtectedRoute>} />
            <Route path="/create-event" element={<ProtectedRoute><NewEvent /></ProtectedRoute>} />

            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><Project /></ProtectedRoute>} />
            
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/users/:id" element={<ProtectedRoute><User /></ProtectedRoute>} />
            <Route path="/create-user" element={<ProtectedRoute><NewUser /></ProtectedRoute>} />

            <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/requests/:id" element={<ProtectedRoute><Request /></ProtectedRoute>} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App
