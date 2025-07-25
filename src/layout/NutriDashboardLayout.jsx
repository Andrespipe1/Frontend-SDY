import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import Header from '../components/HeaderNutri'
import Footer from '../components/Footer'
import { UserIcon, FileTextIcon, MessageCircleIcon, MenuIcon, XIcon, Home, ClockIcon } from 'lucide-react'
import { useAuth } from '../context/AuthProvider'
const NutriDashboardLayout = () => {
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const links = [
    { to: '/dashboard_Nutri', icon: <Home className="w-5 h-5" />, text: 'Inicio' },
    { to: 'perfilNutri', icon: <UserIcon className="w-5 h-5" />, text: 'Perfil' },
    { to: 'listarPacientes', icon: <FileTextIcon className="w-5 h-5" />, text: 'Pacientes' },
    { to: 'chat', icon: <MessageCircleIcon className="w-5 h-5" />, text: 'Chat' },
    { to: 'citas', icon: <ClockIcon className="w-5 h-5" />, text: 'Citas' },


  ]
  if (!user) {
    return <div>No tienes acceso a esta página</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 pt-16 pb-16 flex flex-col relative">
      <Header />

      {/* Botón menú visible solo en móviles */}
      <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow z-30 p-3 flex justify-between items-center">
        <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 cursor-pointer">
          <MenuIcon className="w-6 h-6 text-gray-700" />
          <span className="font-semibold text-gray-800"></span>
        </button>
      </div>

      {/* Overlay oscuro al abrir menú móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />

      )}

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 md:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menú</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="cursor-pointer">
            <XIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {links.map(({ to, icon, text }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard_Nutri'} // Agregar 'end' solo para el enlace "Inicio"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${isActive
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {icon}
              {text}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Desktop */}
      <div className="flex flex-grow">
        <aside className=" hidden md:flex flex-col w-64 bg-white shadow-lg p-6 fixed top-16 bottom-16 left-0 z-10 gap-4">
          {links.map(({ to, icon, text }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard_Nutri'} // Agregar 'end' solo para el enlace "Inicio"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${isActive
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {icon}
              {text}
            </NavLink>
          ))}
        </aside>

        <main className="flex-grow p-6 bg-gray-50 w-full md:ml-64 mt-12 md:mt-0">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default NutriDashboardLayout
