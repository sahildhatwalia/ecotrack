import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const loadUser = async () => {
    if (token) {
      try {
        const res = await api.get('/user/me');
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
        logout();
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
      setLoading(false);
    };
    initialize();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/user/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const signup = async (username, email, password) => {
    const res = await api.post('/user/register', { username, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, api, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
