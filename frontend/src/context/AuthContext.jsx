import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await api.get('auth/me/');
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) {
            fetchUser();
        } else {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.post('auth/login/', { email, password });
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            await fetchUser();
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
