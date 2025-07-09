import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../components/Alerts/Mensaje';
import { FaHome } from 'react-icons/fa';
import logo from '../assets/LogoF.png';

const RestablecerPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [tokenValido, setTokenValido] = useState(false);
  const [form, setForm] = useState({
    password: '',
    confirmpassword: ''
  });

  const handleCloseMensaje = () => {
    setMensaje({});
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Mínimo 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Al menos una mayúscula");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Al menos una minúscula");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Al menos un número");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Al menos un carácter especial (!@#$%^&*)");
    }
    return errors;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const verificarToken = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/recuperar-password/${token}`;
      const { data } = await axios.get(url);
      setMensaje({ respuesta: data.msg, tipo: true });
      setTokenValido(true);
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePassword(form.password);
    if (errors.length > 0) {
      setMensaje({ respuesta: `La contraseña debe tener: ${errors.join(", ")}`, tipo: false });
      return;
    }

    if (form.password !== form.confirmpassword) {
      setMensaje({ respuesta: "Las contraseñas no coinciden", tipo: false });
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/nuevo-password/${token}`;
      const respuesta = await axios.post(url, form);
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
      setForm({ password: '', confirmpassword: '' });
      setTimeout(() => navigate('/login'), 3000); // Redirige al login luego de 3 seg
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  useEffect(() => {
    verificarToken();
  }, []);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 relative">
      {/* Botón de Casita */}
      <Link to="/" className="absolute top-6 left-6 p-2 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-full hover:bg-green-700">
        <FaHome size={24} />
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo} onClose={handleCloseMensaje}>{mensaje.respuesta}</Mensaje>}
        <img
          className="mx-auto h-25 w-auto border-2 border-green-600 rounded-full"
          src={logo}
          alt="Logo"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Restablece tu contraseña
        </h2>
        <p className="text-center text-sm text-red-700 mt-2">
          Escribe tu nueva contraseña y confírmala.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        {tokenValido ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Nueva contraseña
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Nueva contraseña"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Confirmar contraseña
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="confirmpassword"
                  placeholder="Repite la contraseña"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                  value={form.confirmpassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-green-400 to-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Guardar nueva contraseña
              </button>
            </div>

            <p className="text-center text-sm/6 text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-green-600 hover:text-green-500 underline"
              >
                Inicia sesión
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center text-red-600 font-semibold mt-6">
            El enlace no es válido o ha expirado.
          </div>
        )}
      </div>
    </div>
  );
};

export default RestablecerPassword;