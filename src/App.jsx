import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { AuthRoute } from './components/AuthRoute';
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
import PerfilNutri from './pages/PerfilNutri';
import ListarPacientes from './pages/ListarPacientes';
import Formularios from './pages/Formularios';
import Chat from './pages/Chat';
import BienvenidaDashboard from './components/BienvenidaDashboardPaciente';
import Recomendaciones from './pages/Recomendaciones';
import BienvenidaDashboardN from './components/BienvenidaDashboardNutri';
import HistorialPaciente from './pages/HistorialPacientes';
import Citas from './pages/Citas';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta raíz redirige a Landing */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          
          {/* Ruta Landing pública */}
          <Route path="/landing" element={<Landing />} />
          
          {/* Otras rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/recuperar-password/:token" element={<RestablecerPassword />} />
          <Route path="/confirmar/:token" element={<ConfirmarCuenta />} />

          {/* Rutas protegidas para pacientes */}
          <Route element={<AuthRoute requiredRole="paciente" />}>
            <Route path="/dashboard" element={<UserDashboardLayout />}>
              <Route index element={<BienvenidaDashboard rol="paciente" />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="registro" element={<Formularios />} />
              <Route path="chat" element={<Chat />} />
              <Route path="recomendaciones" element={<Recomendaciones />} />
              <Route path="citas" element={<Citas />} />
            </Route>
          </Route>

          {/* Rutas protegidas para nutricionistas */}
          <Route element={<AuthRoute requiredRole="nutricionista" />}>
            <Route path="/dashboard_Nutri" element={<NutriDashboardLayout />}>
              <Route index element={<BienvenidaDashboardN />} />
              <Route path="perfilNutri" element={<PerfilNutri />} />
              <Route path="listarPacientes" element={<ListarPacientes />} />
              <Route path="chat" element={<Chat />} />
              <Route path="historial/:pacienteId" element={<HistorialPaciente />} />
              <Route path="citas" element={<Citas />} />
            </Route>
          </Route>

          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;