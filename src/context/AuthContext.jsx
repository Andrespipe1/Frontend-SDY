import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // Para controlar el estado de carga


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí puedes hacer una petición al backend para validar el token
      // Si el token es válido, deberías guardar los datos del usuario en el estado
      axios
        .get('/api/validate-token', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false); // No es necesario manejar un error si el token es inválido
        });
    } else {
      setLoading(false); // Si no hay token, solo terminamos la carga
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
