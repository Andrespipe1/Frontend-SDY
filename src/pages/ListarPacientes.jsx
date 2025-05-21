import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Mensaje from '../components/Alerts/Mensaje';
import { FaHome, FaUserEdit, FaTrash, FaUser, FaSearch } from 'react-icons/fa';
import logo from '../assets/LogoF.png';
import ModalPaciente from '../components/Modal';

const ListarPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [mensaje, setMensaje] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const token = localStorage.getItem('token');

  // Función para mostrar mensaje con temporizador
  const mostrarMensaje = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  // Obtener lista de pacientes
  useEffect(() => {
    const obtenerPacientes = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/listar-pacientes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (data.success && Array.isArray(data.pacientes)) {
          setPacientes(data.pacientes);
        } else {
          throw new Error('Formato de datos inesperado de la API');
        }
      } catch (error) {
        console.error('Error al obtener pacientes:', error);
        mostrarMensaje({ 
          respuesta: error.response?.data?.msg || 
                   error.message || 
                   'Error al obtener pacientes', 
          tipo: false 
        });
        setPacientes([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerPacientes();
  }, [token]);

  // Eliminar paciente
  const handleEliminarPaciente = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/eliminar-paciente/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        mostrarMensaje({ respuesta: 'Paciente eliminado correctamente', tipo: true });
        // Cerrar modal si está abierto
        setModalAbierto(false);
        // Actualizar lista después de eliminar
        setPacientes(pacientes.filter(paciente => paciente._id !== id));
      } catch (error) {
        mostrarMensaje({ 
          respuesta: error.response?.data?.msg || 'Error al eliminar paciente', 
          tipo: false 
        });
      }
    }
  };

  // Abrir modal con paciente seleccionado
  const abrirModalPaciente = async (pacienteId) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/listar-pacientes/${pacienteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPacienteSeleccionado(data.paciente); // Asignar los datos completos del paciente
      setModalAbierto(true);
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al obtener datos del paciente',
        tipo: false
      });
    }
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setPacienteSeleccionado(null);
  };

  // Filtrar pacientes por búsqueda
  const filteredPacientes = pacientes.filter(paciente => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      paciente.nombre.toLowerCase().includes(searchTermLower) ||
      paciente.apellido.toLowerCase().includes(searchTermLower) ||
      paciente.email.toLowerCase().includes(searchTermLower) ||
      (paciente.celular && paciente.celular.includes(searchTerm))
    );
  });

  return (
    <div className="min-h-full px-6 py-2 lg:px-8">
      {/* Logo y título */}
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        {Object.keys(mensaje).length > 0 && (
          <div className="mb-6">
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          </div>
        )}

        <img
          className="mx-auto h-25 w-auto border-2 border-green-600 rounded-full"
          src={logo}
          alt="Logo"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Listado de Pacientes
        </h2>
      </div>

      {/* Barra de búsqueda */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl flex justify-between items-center mb-6">
        <div className="relative flex-1 mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar pacientes..."
            className="block w-full pl-10 pr-3 py-2 rounded-md bg-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de pacientes */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-4xl bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Cargando pacientes...</div>
        ) : filteredPacientes.length === 0 ? (
          <div className="p-8 text-center">
            {searchTerm ? 'No se encontraron pacientes con ese criterio' : 'No hay pacientes registrados'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPacientes.map((paciente) => (
                  <tr key={paciente._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center text-white font-bold">
                          {paciente.nombre.charAt(0)}{paciente.apellido.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{paciente.nombre} {paciente.apellido}</div>
                          <div className="text-sm text-gray-500">{paciente.edad} años</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{paciente.email}</div>
                      <div className="text-sm text-gray-500">{paciente.celular || 'Sin teléfono'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paciente.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {paciente.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => abrirModalPaciente(paciente._id)} // Pasar el ID del paciente
                        className="text-green-600 hover:text-green-900 mr-4 cursor-pointer"
                        title="Ver perfil"
                      >
                        <FaUser size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminarPaciente(paciente._id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Eliminar"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pie de página */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Mostrando {filteredPacientes.length} de {pacientes.length} pacientes
      </div>

      {/* Modal para ver perfil de paciente */}
      {modalAbierto && (
        <ModalPaciente
          paciente={pacienteSeleccionado} // Pasar los datos completos del paciente
          onClose={cerrarModal}
          onEliminar={handleEliminarPaciente}
          mensaje={mensaje}
        />
      )}
    </div>
  );
};

export default ListarPacientes;