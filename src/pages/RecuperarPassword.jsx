import { Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import Mensaje from '../components/Alerts/Mensaje';
import logo from '../assets/LogoF.png';
import { FaHome } from 'react-icons/fa';

const RecuperarPassword = () => {
  const [mensaje, setMensaje] = useState({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/recuperar-password`;
      const respuesta = await axios.post(url, { email });
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
      setEmail("");
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    } finally {
      setLoading(false);
    }
  }

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
          alt="Logo"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Recupera tu contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          No te preocupes, te enviaremos un correo para que puedas recuperar tu contraseña.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleChange}
                placeholder="Ingresa tu email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-gradient-to-r from-green-400 to-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer hover:opacity-90 transition-opacity"
            >
              {loading ? "Enviando..." : "Enviar email"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          ¿Ya recordaste tu contraseña?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-600 hover:text-green-500 underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RecuperarPassword;
