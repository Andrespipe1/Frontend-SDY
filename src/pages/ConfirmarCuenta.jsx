import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Mensaje from "../components/Alerts/Mensaje";
import logo from '../assets/LogoF.png'; // mismo logo que login

const ConfirmarCuenta = () => {
  const [mensaje, setMensaje] = useState({});
  const [confirmado, setConfirmado] = useState(false);
  const { token } = useParams();

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`;
        const respuesta = await axios.get(url);
        setMensaje({ respuesta: respuesta.data.msg, tipo: true });
        setConfirmado(true);
      } catch (error) {
        setMensaje({ respuesta: error.response?.data?.msg || "Hubo un error al confirmar tu cuenta", tipo: false });
      }
    };
    confirmarCuenta();
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-24 w-24 border-2 border-green-600 rounded-full"
          src={logo}
          alt="Logo"
        />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Confirmación de Cuenta
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm bg-white shadow-lg rounded-lg p-6">
        {Object.keys(mensaje).length > 0 && (
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
        )}

        {confirmado && (
          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="inline-block w-full bg-gradient-to-r from-green-400 to-blue-600 text-white py-2 px-4 rounded-md hover:from-green-500 hover:to-blue-700 transition"
            >
              Ir al Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmarCuenta;
