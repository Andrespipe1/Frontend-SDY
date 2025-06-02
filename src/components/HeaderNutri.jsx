import { useAuth } from '../context/AuthProvider'
const Header = () => {
  const {logout } = useAuth();


  return (
    <header className="bg-gradient-to-r from-green-400 to-blue-600 text-white py-3 px-6 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
      <h1 className="text-xl font-bold">SALUDIFY - ADM</h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white-600 px-3 py-2 rounded hover:bg-red-600 transition cursor-pointer"
      >
        Cerrar sesión
      </button>
    </header>
  )
}

export default Header
