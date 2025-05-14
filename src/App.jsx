import { useState } from 'react'

import NotFound from './pages/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import RecuperarPassword from './pages/RecuperarPassword'
import UserDashboardLayout from './layout/UserDashboardLayout'
import { AuthProvider } from './context/AuthContext'
import NutriDashboardLayout from './layout/NutriDashboardLayout'
import RestablecerPassword from './pages/RestablecerPassword'
import ConfirmarCuenta from './pages/ConfirmarCuenta'
function App() {

  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<UserDashboardLayout />}/>
          <Route path="dashboard_Nutri" element={<NutriDashboardLayout />}/>
  
          <Route path="recuperar-password" element={<RecuperarPassword />} />
          <Route path="recuperar-password/:token" element={<RestablecerPassword/>}/>
          <Route path="/confirmar/:token" element={<ConfirmarCuenta />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
