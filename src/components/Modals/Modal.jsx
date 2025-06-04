import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Mensaje from '../Alerts/Mensaje';

const ModalPaciente = ({ 
  paciente, 
  onClose, 
  mensaje 
}) => {
  const navigate = useNavigate();

  if (!paciente) return null;

  const handleVerHistorial = () => {
    onClose(); // Cierra el modal primero
    // Navega a la ruta dentro del dashboard del nutricionista
    navigate(`/dashboard_Nutri/historial/${paciente._id}`);
  };

  return (
    <div
      className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b px-6 py-5 bg-gray-50 rounded-t-2xl">
          <h3 className="text-2xl font-bold text-gray-800">
            Perfil de {paciente.nombre} {paciente.apellido}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <FaTimes size={22} />
          </button>
        </div>

        {/* Mensaje */}
        {mensaje.respuesta && (
          <div className="px-6 pt-4">
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div>
              <div className="flex items-center mb-6">
                {/* Avatar del paciente */}
                <div className='h-16 w-16 rounded-full'>
                    {paciente.avatar ? (
                    <img
                      src={paciente.avatar}
                      alt={paciente.nombre}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {paciente.nombre.charAt(0)}{paciente.apellido.charAt(0)}
                    </div>
                    )}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {paciente.nombre} {paciente.apellido}
                  </h4>
                  <p className="text-gray-600">{paciente.edad} años</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                    paciente.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {paciente.status ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-500">Email</h5>
                  <p className="mt-1 text-sm text-gray-900">{paciente.email}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                    paciente.confirmEmail ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {paciente.confirmEmail ? 'Email confirmado' : 'Email pendiente'}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-500">Teléfono</h5>
                  <p className="mt-1 text-sm text-gray-900">{paciente.celular || 'No registrado'}</p>
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500">Dirección</h5>
                <p className="mt-1 text-sm text-gray-900">{paciente.direccion || 'No registrada'}</p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-500">Fecha de Registro</h5>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(paciente.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {paciente.parametros && paciente.parametros.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-500">Últimos Parámetros</h5>
                  <div className="mt-2 space-y-2 text-sm text-gray-900">
                    <p><span className="font-semibold">Peso:</span> {paciente.parametros[0].peso} kg</p>
                    <p><span className="font-semibold">Estatura:</span> {paciente.parametros[0].estatura} cm</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* Acciones */}
        <div className="flex justify-end gap-4 border-t pt-4">
          <button
            onClick={handleVerHistorial}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Ver historial
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPaciente;