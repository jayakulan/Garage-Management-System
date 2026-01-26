import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate(); // Standard context usually shouldn't depend on router, but for simple apps it's fine or handle in components.

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry if needed
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password }), // Backend expects 'username' if using standard User model, but user enters email usually. I'll pass email as username for now or check if I need to adjust backend.
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh', data.refresh);

            const decoded = jwtDecode(data.access);
            setUser(decoded);
            return decoded; // Return decoded user to handle redirect in component
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                // Django DRF typically returns field-specific errors or a 'detail' key
                const errorMessage = errorData.detail ||
                    (Object.keys(errorData).length > 0
                        ? Object.entries(errorData).map(([key, val]) => `${key}: ${val}`).join(', ')
                        : 'Signup failed');
                throw new Error(errorMessage);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
