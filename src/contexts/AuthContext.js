import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
    loggedIn: false,
    isAdmin: false,
    username: '',
  });

    useEffect(() => {

        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/api/data'); // ✅ 토큰 자동 포함
                console.log('User data:', response.data);
                const { username, isAdmin } = response.data;

        setUser({
          loggedIn: true,
          isAdmin: isAdmin,
          username: username,
        });
        localStorage.setItem('username', username);
            } catch (err) {
                console.error("Fetch error:", err);
                setUser({ loggedIn: false, isAdmin: false, username: '' });
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
