import { createContext, useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('authToken', data.token);
            setUser({ email });
            navigate('/');
        } catch (error) {
            console.error('Error logging in:', error.response ? error.response.data : error.message);
        }
    };

    const register = async (username, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { username, email, password });
            localStorage.setItem('authToken', data.token);
            setUser({ email });
            navigate('/');
        } catch (error) {
            console.error('Error registering:', error.response ? error.response.data : error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setUser({ email: 'placeholder_email@example.com' }); // Fetch real user data if needed
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
