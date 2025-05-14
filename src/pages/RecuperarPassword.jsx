import { Link } from "react-router";
import { useState } from 'react';
import axios from 'axios';
import Mensaje from '../components/Alerts/Mensaje';


const RecuperarPassword = () => {
  const [mensaje, setMensaje] = useState({});
  const [email, setEmail] = useState({});
  
  const handleChange = (e) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url= `${import.meta.env.VITE_BACKEND_URL}/recuperar-password`;
      const respuesta = await axios.post(url, email);
      setMensaje({respuesta: respuesta.data.msg, tipo: true});
      setEmail("");

    } catch (error) {
      setMensaje({respuesta: error.response.data.msg, tipo: false});
    }
  }
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-[1000px] md:w-[600px] md:h-[400px] p-8 md:p-10 flex flex-col justify-center">
      {Object.keys(mensaje).length > 0 && (<Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>)}
        <h1 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Recupera tu contraseña
        </h1>
        <small className="text-red-700 block my-4 text-sm text-center">
          No te preocupes, te enviaremos un correo para que puedas recuperar tu contraseña.
        </small>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Ingresa tu email"
              className="block w-full rounded-md border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 py-2 px-3 text-gray-700"
              name="email"
              onChange={handleChange}
            />
          </div>

          <button className="bg-gradient-to-r from-green-400 to-blue-600 text-white py-2 w-full rounded-lg mt-3 hover:bg-indigo-500 cursor-pointer transition duration-300">
            Enviar email
          </button>
        </form>

        <div className="mt-5 text-sm flex justify-between items-center">
          <p>¿Ya recordaste tu contraseña?</p>
          <Link
            to="/login"
            className="py-2 px-6 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarPassword;
