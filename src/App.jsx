import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RecuperarPassword from './pages/RecuperarPassword';
import RestablecerPassword from './pages/RestablecerPassword';
import ConfirmarCuenta from './pages/ConfirmarCuenta';
import NotFound from './pages/NotFound';

import UserDashboardLayout from './layout/UserDashboardLayout';
import NutriDashboardLayout from './layout/NutriDashboardLayout';

import Perfil from './pages/Perfil';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/recuperar-password/:token" element={<RestablecerPassword />} />
          <Route path="/confirmar/:token" element={<ConfirmarCuenta />} />

          {/* Rutas protegidas para usuarios */}
          <Route path="/dashboard" element={<UserDashboardLayout />}>
            <Route path="perfil" element={<Perfil />} />
            {/* Aquí puedes agregar más rutas dentro del dashboard del usuario uwu */}
          </Route>

          {/* Rutas protegidas para nutricionistas (por si luego agregas más subrutas) */}
          <Route path="/dashboard_Nutri" element={<NutriDashboardLayout />} />

          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
