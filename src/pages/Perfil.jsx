import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Mensaje from '../components/Alerts/Mensaje';

const PerfilNutri = () => {
  const [mensaje, setMensaje] = useState({});
  const [perfil, setPerfil] = useState({ nombre: '',apellido:'', email: '', _id: '' ,edad: '',direccion: '', celular: ''});

  const [passwordForm, setPasswordForm] = useState({
    passwordactual: '',
    passwordnuevo: ''
  });

  const mostrarMensaje = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    // Limpiar el mensaje después de 5 segundos (5000 milisegundos)
    setTimeout(() => {
      setMensaje({});
    }, 3000);
  };
  const token = localStorage.getItem('token');

  // Obtener datos del perfil al cargar la página
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPerfil(data); // Se espera que el backend devuelva nombre, email y _id
      } catch (error) {
        mostrarMensaje({ respuesta: 'Error al obtener el perfil', tipo: false });
      }
    };

    obtenerPerfil();
  }, []);

  // Actualizar campos del perfil
  const handlePerfilChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  // Actualizar campos del formulario de contraseña
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Enviar cambios del perfil
  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/${perfil._id}`,
        perfil,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      mostrarMensaje({ respuesta: data.msg || 'Perfil actualizado correctamente', tipo: true });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al actualizar perfil',})
    }
  };

  // Enviar cambio de contraseña
  const handleActualizarPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/actualizar-password/${perfil._id}`,
        passwordForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      mostrarMensaje({ respuesta: data.msg, tipo: true });
      setPasswordForm({ passwordactual: '', passwordnuevo: '' });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al actualizar contraseña',});
        setPasswordForm({ passwordactual: '', passwordnuevo: '' });
    }
  };

  return (
    <div className="flex flex-col items-center px-6">
      {/* Contenedor fijo para mensajes en la parte superior */}
      <div className="w-full lg:w-2/3 mb-6 fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        {Object.keys(mensaje).length > 0 && (
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
        )}
      </div>

      {/* Contenedor principal de los formularios */}
      <div className="flex flex-col lg:flex-row gap-10 justify-center items-start w-full mt-16">
        {/* Actualizar Perfil */}
        <form onSubmit={handleActualizarPerfil} className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/2">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Actualizar Perfil</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={perfil.nombre}
              onChange={handlePerfilChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={perfil.apellido}
              onChange={handlePerfilChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Edad</label>
            <input
              type="number"
              name="edad"
              value={perfil.edad}
              onChange={handlePerfilChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={perfil.direccion}
              onChange={handlePerfilChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Celular</label>
            <input
              type="text"
              name="celular"
              value={perfil.celular}
              onChange={handlePerfilChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
          >
            Guardar cambios
          </button>
        </form>

        {/* Actualizar Contraseña */}
        <form onSubmit={handleActualizarPassword} className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-1/2">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Cambiar Contraseña</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
            <input
              type="password"
              name="passwordactual"
              value={passwordForm.passwordactual}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <input
              type="password"
              name="passwordnuevo"
              value={passwordForm.passwordnuevo}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default PerfilNutri;



