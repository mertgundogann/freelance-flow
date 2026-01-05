import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Sayfa yönlendirmesi için gerekli
import api from '../api/axios'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
           
            const response = await api.post('/auth/login', { email, password });
            
            
            localStorage.setItem('token', response.data.token);
            
            console.log("Giriş başarılı!");

            
            navigate('/notes'); 
          
        } catch (error) {
            
            alert(error.response?.data?.message || "Bir hata oluştu");
        }
    };

    return (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <h2>Giriş Yap 🔑</h2>
            <input 
                type="email" 
                placeholder="E-posta" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
            />
            <input 
                type="password" 
                placeholder="Şifre" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
            />
            <button type="submit">Giriş Yap</button>
        </form>
    );
};

export default Login;