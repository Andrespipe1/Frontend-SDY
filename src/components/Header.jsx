import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Aquí limpias el token o estado de auth
    localStorage.removeItem('token') // si usas token
    navigate('/login')
  }

  return (
    <header className="bg-indigo-600 text-white py-3 px-6 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
      <h1 className="text-xl font-bold">SALUDIFY :V</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white-600 px-3 py-2 rounded hover:bg-red-600 transition cursor-pointer"
      >
        Cerrar sesión
      </button>
    </header>
  )
}

export default Header
