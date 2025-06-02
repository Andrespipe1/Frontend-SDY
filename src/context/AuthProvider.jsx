import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!storedToken || !storedUser) {
          setLoading(false);
          return;
        }

        // Decodificar el token sin verificar (solo para obtener datos)
        const decoded = jwtDecode(storedToken);
        
        // Verificar estructura básica del token
        if (!decoded.id || !decoded.rol || !decoded.exp) {
          throw new Error("Token inválido");
        }

        // Verificar expiración
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          throw new Error("Token expirado");
        }

        // Verificar consistencia con el usuario almacenado
        const parsedUser = JSON.parse(storedUser);
        if (decoded.id !== parsedUser._id) {
          throw new Error("Inconsistencia en datos de usuario");
        }

        // Todo válido, establecer estado
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error("Error de autenticación:", error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);