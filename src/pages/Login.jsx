import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mensaje from "../components/Alerts/Mensaje";
import axios from "axios";
import logo from '../assets/LogoF.png';
import { FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mensaje, setMensaje] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleCloseMensaje = () => {
    setMensaje({});
  };

  // Efecto para manejar el tiempo de bloqueo
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleChange = (e) => {
    // Sanitización básica de inputs
    const value = e.target.value.trim();
    setForm({
      ...form,
      [e.target.name]: value
    });
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el usuario está bloqueado
    if (lockoutTime > 0) {
      setMensaje({
        respuesta: `Demasiados intentos. Intente nuevamente en ${lockoutTime} segundos`,
        tipo: false
      });
      return;
    }

    // Validaciones
    if (!form.email || !form.password) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return;
    }

    if (!validateEmail(form.email)) {
      setMensaje({ respuesta: "Por favor, ingrese un email válido", tipo: false });
      return;
    }

    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/login`;
      const { data } = await axios.post(url, form, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        timeout: 5000 // Timeout de 5 segundos
      });

      if (!data.token || !data.user) {
        throw new Error("Respuesta inválida del servidor");
      }

      // Resetear intentos fallidos después de un login exitoso
      setAttempts(0);

      const userData = {
        _id: data.user._id,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
        email: data.user.email,
        rol: data.user.rol,
        ...(data.user.edad && { edad: data.user.edad }),
        ...(data.user.direccion && { direccion: data.user.direccion }),
        ...(data.user.celular && { celular: data.user.celular })
      };

      login(userData, data.token);
      navigate(data.user.rol === "nutricionista" ? "/dashboard_Nutri" : "/dashboard");

    } catch (error) {
      console.error("Error en login:", error);

      // Incrementar intentos fallidos
      setAttempts(prev => prev + 1);

      // Implementar bloqueo después de 3 intentos fallidos
      if (attempts >= 2) {
        setLockoutTime(30); // Bloquear por 30 segundos
        setMensaje({
          respuesta: "Demasiados intentos fallidos. Cuenta bloqueada por 30 segundos",
          tipo: false
        });
      } else {
        let errorMsg = "Ocurrió un error al iniciar sesión";
        if (error.response) {
          errorMsg = error.response.data?.msg || errorMsg;
        } else if (error.request) {
          errorMsg = "No se pudo conectar al servidor";
        }
        setMensaje({ respuesta: errorMsg, tipo: false });
      }
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
        {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo} onClose={handleCloseMensaje}>{mensaje.respuesta}</Mensaje>}
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