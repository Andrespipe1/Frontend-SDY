import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mensaje from "../components/Alerts/Mensaje";
import axios from "axios";
import logo from '../assets/LogoF.png';
import { FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Correctamente colocado aquí
  const [mensaje, setMensaje] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({  
    email: "",
    password: ""
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!form.email || !form.password) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      setLoading(false);
      return;
    }
  
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/login`;
      const { data } = await axios.post(url, form);
      
      if (!data.token || !data.user) {
        throw new Error("Respuesta inválida del servidor");
      }
    
      // Guardar información en formato consistente con el backend
      const userData = {
        _id: data.user._id,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
        email: data.user.email,
        rol: data.user.rol,
        // otros campos según necesites
        ...(data.user.edad && { edad: data.user.edad }),
        ...(data.user.direccion && { direccion: data.user.direccion }),
        ...(data.user.celular && { celular: data.user.celular })
      };
  
      // Usar el AuthProvider para hacer login
      login(userData, data.token);
      
      // Redirigir según el rol
      navigate(data.user.rol === "nutricionista" ? "/dashboard_Nutri" : "/dashboard");
      
    } catch (error) {
      console.error("Error en login:", error);
      
      // Manejo de errores específicos
      let errorMsg = "Ocurrió un error al iniciar sesión";
      if (error.response) {
        // Error de respuesta del servidor
        errorMsg = error.response.data?.msg || errorMsg;
      } else if (error.request) {
        // Error de conexión
        errorMsg = "No se pudo conectar al servidor";
      }
      
      setMensaje({ respuesta: errorMsg, tipo: false });
      setTimeout(() => setMensaje({}), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {/* Botón de Casita en la esquina izquierda */}
      <Link to="/" className="absolute top-6 left-6 p-2 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-full hover:bg-green-700">
        <FaHome size={24} />
      </Link>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
        <img
          className="mx-auto h-25 w-auto border-2 border-green-600 rounded-full"
          src={logo}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Ingresa con tu cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Contraseña
              </label>
              <div className="text-sm">
                <Link
                  to="/recuperar-password"
                  className="font-semibold text-green-600 hover:text-green-500 underline"
                >
                  Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-gradient-to-r from-green-400 to-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </div>

          <p className="text-center text-sm/6 text-gray-500">
            No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-600 hover:text-green-500 underline"
            >
              Regístrate ahora
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;