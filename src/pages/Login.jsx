import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mensaje from "../components/Alerts/Mensaje";
import axios from "axios";
import logo from '../assets/Logo.jpg';
import { FaHome } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true);
    
    const url = `${import.meta.env.VITE_BACKEND_URL}/login`; // Asegúrate de que la ruta es correcta
    
    try {
      const { data } = await axios.post(url, form);
      
      // La respuesta del backend ahora tiene esta estructura:
      // {
      //   success: true,
      //   token: "...",
      //   user: { _id, nombre, apellido, email, rol, ...otrosDatos }
      // }
      
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      
      // Guardar datos del usuario en localStorage o contexto
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirección basada en el rol
      if (data.user.rol === "nutricionista") {
        navigate("/dashboard_Nutri");
      } else if (data.user.rol === "paciente") {
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Error en login:", error);
      
      // Manejo de errores mejorado
      const errorMsg = error.response?.data?.msg || 
                      error.response?.data?.message || 
                      "Ocurrió un error al iniciar sesión";
      
      setMensaje({ 
        respuesta: errorMsg, 
        tipo: false 
      });
      
      setForm({ email: "", password: "" });
      
      setTimeout(() => {
        setMensaje({});
      }, 3000);
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
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-gradient-to-r from-green-400 to-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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