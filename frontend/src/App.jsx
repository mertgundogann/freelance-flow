import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Notes from './pages/Notes.jsx'; 
import Navbar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute'; // Import etmeyi unutma!

function App() {
  return (
    <BrowserRouter>
      {/* Navbar artık Router içinde, böylece useNavigate çalışabilir */}
      <Navbar /> 
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        {/* Sadece Korumalı Rota kalsın */}
        <Route 
          path="/notes" 
          element={
            <PrivateRoute>
              <Notes />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;