import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

 
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Ana sayfa yönlendirmesi */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/notes" /> : <Navigate to="/login" />} 
        />
        
        {/* Login Sayfası */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={handleLoginSuccess} /> : <Navigate to="/notes" />} 
        />
        
        {/* Register Sayfası */}
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/notes" />} 
        />
        
        {/* Notlar Sayfası (Korumalı) */}
        <Route 
          path="/notes" 
          element={isAuthenticated ? <Notes onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;