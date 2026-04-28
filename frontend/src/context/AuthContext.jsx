import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user:', err);
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  };

  const register = async (name, email, password, role) => {
    const res = await API.post('/auth/register', { name, email, password, role });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      await loadUser();
      return { success: true, autologin: true };
    }
    return { success: true, autologin: false, message: res.data.message };
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
