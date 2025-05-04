import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import RecuperarPassword from './pages/RecuperarPassword'
import NotFound from './pages/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import UserDashboardLayout from './layout/UserDashboardLayout'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<UserDashboardLayout />}/>
          <Route path="recuperar-password" element={<RecuperarPassword />} />
          <Route path="*" element={<NotFound />} />


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
