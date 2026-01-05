import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
   
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    return (
        <nav style={{ 
            padding: '10px 20px', 
            background: '#333', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center' 
        }}>
            <strong style={{ fontSize: '1.2rem' }}>Not Defterim 📒</strong>
            
            
            {token && (
                <button 
                    onClick={handleLogout} 
                    style={{ 
                        backgroundColor: '#ff4d4d', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 15px', 
                        borderRadius: '5px',
                        cursor: 'pointer' 
                    }}
                >
                    Çıkış Yap 🚪
                </button>
            )}
        </nav>
    );
};

export default Navbar;