import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import Mensaje from '../components/Alerts/Mensaje';

const Citas = () => {
  const [citas, setCitas] = useState([]);
  const [modalidad, setModalidad] = useState('presencial');
  const [descripcion, setDescripcion] = useState('');
  const [nutricionistaId, setNutricionistaId] = useState('');
  const [nutricionistas, setNutricionistas] = useState([]);
  const [mensaje, setMensaje] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [fechaConfirmacion, setFechaConfirmacion] = useState('');
  const [citaAConfirmar, setCitaAConfirmar] = useState(null);
  const token = localStorage.getItem('token');

  const mostrarMensaje = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        let perfilResponse;
        try {
          perfilResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          perfilResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfilNutri`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        setUserRole(perfilResponse.data.role || perfilResponse.data.rol || 'paciente');
        setUserId(perfilResponse.data._id);

        if ((perfilResponse.data.role || perfilResponse.data.rol) === 'paciente') {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/listar-nutricionistas`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setNutricionistas(data);
          if (data.length > 0) {
            setNutricionistaId(data[0]._id);
          }
        }

        obtenerCitas(perfilResponse.data.role || perfilResponse.data.rol, perfilResponse.data._id);
      } catch (error) {
        console.error('Error al obtener datos iniciales:', error);
        mostrarMensaje({
          respuesta: error.response?.data?.msg || 'Error al cargar datos',
          tipo: false
        });
      } finally {
        setLoading(false);
      }
    };

    obtenerDatosIniciales();
  }, [token]);

  const obtenerCitas = async (role, id) => {
    try {
      let endpoint = '';
      if (role === 'paciente') {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/paciente/${id}`;
      } else if (role === 'nutricionista') {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/nutricionista/${id}`;
      }

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener citas:', error);
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al obtener citas',
        tipo: false
      });
      setCitas([]);
    }
  };

  const handleCrearCita = async (e) => {
    e.preventDefault();
    
    if (!descripcion || !nutricionistaId) {
      mostrarMensaje({
        respuesta: 'Por favor completa todos los campos obligatorios',
        tipo: false
      });
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/registrar-cita`,
        {
          paciente: userId,
          nutricionista: nutricionistaId,
          modalidad,
          descripcion
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje({
        respuesta: data.msg || 'Cita creada correctamente. El nutricionista la confirmará pronto.',
        tipo: true
      });

      setDescripcion('');
      obtenerCitas(userRole, userId);
    } catch (error) {
      console.error('Error al crear cita:', error);
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al crear cita',
        tipo: false
      });
    }
  };

  const handleConfirmarCita = async () => {
    if (!fechaConfirmacion) {
      mostrarMensaje({
        respuesta: 'Por favor ingresa una fecha y hora',
        tipo: false
      });
      return;
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/confirmar-cita/${citaAConfirmar._id}`,
        { fecha: fechaConfirmacion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje({
        respuesta: data.msg || 'Cita confirmada correctamente',
        tipo: true
      });

      setFechaConfirmacion('');
      setCitaAConfirmar(null);
      obtenerCitas(userRole, userId);
    } catch (error) {
      console.error('Error al confirmar cita:', error);
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al confirmar cita',
        tipo: false
      });
    }
  };

  const handleCancelarCita = async (citaId) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/cancelar-cita/${citaId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje({
        respuesta: data.msg || 'Cita cancelada correctamente',
        tipo: true
      });

      obtenerCitas(userRole, userId);
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al cancelar cita',
        tipo: false
      });
    }
  };

  const handleEliminarCita = async (citaId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/eliminar-cita/${citaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje({
        respuesta: data.msg || 'Cita eliminada correctamente',
        tipo: true
      });

      obtenerCitas(userRole, userId);
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al eliminar cita',
        tipo: false
      });
    }
  };

  const filteredCitas = citas.filter(cita => {
    const searchTermLower = searchTerm.toLowerCase();
    const pacienteNombre = cita.paciente?.nombre?.toLowerCase() || '';
    const pacienteApellido = cita.paciente?.apellido?.toLowerCase() || '';
    const nutriNombre = cita.nutricionista?.nombre?.toLowerCase() || '';
    const nutriApellido = cita.nutricionista?.apellido?.toLowerCase() || '';
    const descripcionLower = cita.descripcion.toLowerCase();
    const estadoLower = cita.estado.toLowerCase();

    return (
      pacienteNombre.includes(searchTermLower) ||
      pacienteApellido.includes(searchTermLower) ||
      nutriNombre.includes(searchTermLower) ||
      nutriApellido.includes(searchTermLower) ||
      descripcionLower.includes(searchTermLower) ||
      estadoLower.includes(searchTermLower) ||
      (cita.fecha && new Date(cita.fecha).toLocaleString().includes(searchTerm))
    );
  });

  const formatFecha = (fecha) => {
    if (!fecha) return 'Por confirmar';
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Cargando tus datos...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-full px-6 py-2 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        {Object.keys(mensaje).length > 0 && (
          <div className="mb-6">
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          {userRole === 'paciente' ? 'Mis Citas' : 'Gestión de Citas'}
        </h2>
      </div>

      {userRole === 'paciente' && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-5xl bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitar Nueva Cita</h3>
          
          <form onSubmit={handleCrearCita} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nutricionista</label>
                <select
                  value={nutricionistaId}
                  onChange={(e) => setNutricionistaId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                  required
                >
                  {nutricionistas.length > 0 ? (
                    nutricionistas.map((nutri) => (
                      <option key={nutri._id} value={nutri._id}>
                        {nutri.nombre} {nutri.apellido}
                      </option>
                    ))
                  ) : (
                    <option value="">Cargando nutricionistas...</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Modalidad</label>
                <select
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                placeholder="Describe el motivo de tu consulta"
                rows="3"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
              >
                <FaCalendarAlt /> Solicitar Cita
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar citas..."
            className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      {/* Sección de confirmación de cita (solo para nutricionistas) */}
      {userRole === 'nutricionista' && citaAConfirmar && (
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-4xl bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar Cita</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Paciente: <span className="font-medium">{citaAConfirmar.paciente?.nombre} {citaAConfirmar.paciente?.apellido}</span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Modalidad: <span className="font-medium capitalize">{citaAConfirmar.modalidad}</span>
            </p>
            <p className="text-sm text-gray-600">
              Motivo: <span className="font-medium">{citaAConfirmar.descripcion}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Input de fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de la cita
              </label>
              <input
                type="date"
                value={fechaConfirmacion.split('T')[0] || ''}
                onChange={(e) => {
                  const fecha = e.target.value;
                  const hora = fechaConfirmacion.split('T')[1] || '12:00';
                  setFechaConfirmacion(`${fecha}T${hora}`);
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Input de hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de la cita
              </label>
              <input
                type="time"
                value={fechaConfirmacion.split('T')[1] || '12:00'}
                onChange={(e) => {
                  const hora = e.target.value;
                  const fecha = fechaConfirmacion.split('T')[0] || new Date().toISOString().split('T')[0];
                  setFechaConfirmacion(`${fecha}T${hora}`);
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setCitaAConfirmar(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarCita}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Confirmar Cita
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-4xl bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Cargando citas...</div>
        ) : filteredCitas.length === 0 ? (
          <div className="p-8 text-center">
            {searchTerm ? 'No se encontraron citas con ese criterio' : 'No hay citas registradas'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {userRole === 'paciente' ? 'Nutricionista' : 'Paciente'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCitas.map((cita) => (
                  <tr key={cita._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center text-white font-bold">
                          {userRole === 'paciente' 
                            ? `${cita.nutricionista?.nombre?.charAt(0) || 'N'}${cita.nutricionista?.apellido?.charAt(0) || 'A'}`
                            : `${cita.paciente?.nombre?.charAt(0) || 'P'}${cita.paciente?.apellido?.charAt(0) || 'A'}`}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userRole === 'paciente' 
                              ? `${cita.nutricionista?.nombre || 'Nutricionista'} ${cita.nutricionista?.apellido || ''}`
                              : `${cita.paciente?.nombre || 'Paciente'} ${cita.paciente?.apellido || ''}`}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">{cita.modalidad}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{cita.descripcion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <FaClock className="text-green-600" />
                        {formatFecha(cita.fecha)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                        cita.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                        cita.estado === 'completada' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {userRole === 'nutricionista' && cita.estado === 'pendiente' && (
                        <button
                          onClick={() => setCitaAConfirmar(cita)}
                          className="text-green-600 hover:text-green-900 mr-3 cursor-pointer"
                          title="Confirmar cita"
                        >
                          <FaCheck size={16} />
                        </button>
                      )}
                      
                      {(userRole === 'paciente' || (userRole === 'nutricionista' && cita.estado !== 'completada')) && (
                        <button
                          onClick={() => handleCancelarCita(cita._id)}
                          className="text-yellow-600 hover:text-yellow-900 mr-3 cursor-pointer"
                          title="Cancelar cita"
                          disabled={cita.estado === 'cancelada'}
                        >
                          <FaTimes size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleEliminarCita(cita._id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Eliminar cita"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Mostrando {filteredCitas.length} de {citas.length} citas
      </div>
    </div>
  );
};

export default Citas;