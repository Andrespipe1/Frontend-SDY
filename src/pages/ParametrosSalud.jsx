import React, { useState, useEffect } from 'react';
import Mensaje from '../components/Alerts/Mensaje';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaCalendarAlt, FaTrash, FaSearch, FaEdit } from 'react-icons/fa';

const ParametrosSalud = () => {
  const [mensaje, setMensaje] = useState({});
  const [parametros, setParametros] = useState({
    peso: '',
    estatura: '',
    nivelActividadFisica: 'Bajo',
    enfermedad: '',
    discapacidad: ''
  });
  const [historial, setHistorial] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const pacienteId = decodedToken?.id;

  const mostrarMensaje = (mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  const historialFiltrado = historial.filter((item) => {
    if (!fechaFiltro) return true;
    return item.createdAt.startsWith(fechaFiltro);
  });

  // Get the latest record for display
  const ultimoRegistro = historial.length > 0 ? historial.at(-1) : null;

  // Obtener parámetros e historial
  useEffect(() => {
    const obtenerDatos = async () => {
      if (!pacienteId) return;
      
      try {
        // Obtener historial de parámetros
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        // Manejar historial
        setHistorial(data?.parametros || []);

        // Resetear formulario
        setParametros({
          peso: '',
          estatura: '',
          nivelActividadFisica: 'Bajo',
          enfermedad: '',
          discapacidad: ''
        });
        setIsEditing(false);
        setCurrentEditId(null);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        mostrarMensaje({
          respuesta: error.response?.data?.msg || 'Error al obtener datos',
          tipo: false
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    obtenerDatos();
  }, [token, pacienteId]);

  const cargarDatosParaEdicion = (registro) => {
    setParametros({
      peso: registro.peso,
      estatura: registro.estatura,
      nivelActividadFisica: registro.nivelActividadFisica,
      enfermedad: registro.enfermedad || '',
      discapacidad: registro.discapacidad || ''
    });
    setIsEditing(true);
    setCurrentEditId(registro._id);
  };

  const cancelarEdicion = () => {
    setParametros({
      peso: '',
      estatura: '',
      nivelActividadFisica: 'Bajo',
      enfermedad: '',
      discapacidad: ''
    });
    setIsEditing(false);
    setCurrentEditId(null);
  };

  const registrarParametros = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parametros-salud/registro`,
        { ...parametros, paciente: pacienteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      mostrarMensaje({ respuesta: 'Parámetros registrados correctamente', tipo: true });
      
      // Actualizar historial
      const { data: nuevosDatos } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistorial(nuevosDatos?.parametros || []);
      
      // Resetear formulario
      setParametros({
        peso: '',
        estatura: '',
        nivelActividadFisica: 'Bajo',
        enfermedad: '',
        discapacidad: ''
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al registrar los parámetros',
        tipo: false
      });
    }
  };

  const actualizarParametros = async () => {
    try {
      // Actualizar los parámetros del paciente
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar-parametro/${currentEditId}`,
        { ...parametros, paciente: pacienteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      mostrarMensaje({ respuesta: 'Datos actualizados correctamente', tipo: true });
  
      // Obtener el historial actualizado
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistorial(data.parametros || []);
  
      // Resetear el formulario
      setParametros({
        peso: '',
        estatura: '',
        nivelActividadFisica: 'Bajo',
        enfermedad: '',
        discapacidad: ''
      });
      setIsEditing(false);
      setCurrentEditId(null);
    } catch (error) {
      console.error('Error al actualizar los datos:', error); // Agrega un log para depuración
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al actualizar los datos',
        tipo: false
      });
    }
  };

  const eliminarParametros = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/eliminar-parametro/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar historial
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistorial(data.parametros || []);

      mostrarMensaje({ respuesta: 'Registro eliminado correctamente', tipo: true });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al eliminar el registro',
        tipo: false
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await actualizarParametros();
    } else {
      await registrarParametros();
    }
  };

  const calcularIMC = (peso, estatura) => {
    if (peso && estatura) {
      const alturaEnMetros = estatura / 100;
      const imc = (peso / (alturaEnMetros * alturaEnMetros)).toFixed(1);
      
      let clasificacion = '';
      let colorClass = '';
      if (imc < 18.5) {
        clasificacion = 'Bajo peso';
        colorClass = 'text-blue-600';
      } else if (imc >= 18.5 && imc < 25) {
        clasificacion = 'Normal';
        colorClass = 'text-green-600';
      } else if (imc >= 25 && imc < 30) {
        clasificacion = 'Sobrepeso';
        colorClass = 'text-yellow-600';
      } else if (imc >= 30) {
        clasificacion = 'Obesidad';
        colorClass = 'text-red-600';
      }
      
      return { valor: imc, clasificacion, colorClass };
    }
    return { valor: '', clasificacion: '', colorClass: '' };
  };

  const imcActual = calcularIMC(
    isEditing ? parametros.peso : (ultimoRegistro?.peso || ''),
    isEditing ? parametros.estatura : (ultimoRegistro?.estatura || '')
  );

  const handleChange = (e) => {
    setParametros({
      ...parametros,
      [e.target.name]: e.target.value
    });
  };

  const calcularPosicionIndicador = (imcValue) => {
    if (!imcValue) return 0;
    return Math.min(Math.max((imcValue - 15) / (40 - 15) * 100, 0), 100);
  };

  if (!token) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <Mensaje tipo={false}>Debes iniciar sesión para acceder a esta función</Mensaje>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pb-4 sm:pb-8">
      {mensaje.respuesta && (
        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
      )}
      
      {isLoading ? (
        <div className="p-4 sm:p-6 text-center">Cargando...</div>
      ) : (
        <>
          {/* Contenedor principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md mb-4 sm:mb-6">
            {/* Sección izquierda - Formulario */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">
                {isEditing ? 'Editar Parámetros' : 'Registrar Nuevos Parámetros'}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="peso"
                      className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={parametros.peso}
                      onChange={handleChange}
                      placeholder="70.5"
                      required
                      min="0"
                      step="0.1"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">kg</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estatura (cm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="estatura"
                      className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={parametros.estatura}
                      onChange={handleChange}
                      placeholder="175"
                      required
                      min="0"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">cm</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Actividad Física</label>
                  <select
                    name="nivelActividadFisica"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    value={parametros.nivelActividadFisica}
                    onChange={handleChange}
                    required
                  >
                    <option value="Bajo">Bajo</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Alto">Alto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enfermedad (opcional)</label>
                  <input
                    type="text"
                    name="enfermedad"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    value={parametros.enfermedad}
                    onChange={handleChange}
                    placeholder="Ej: Diabetes, Hipertensión"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discapacidad (opcional)</label>
                  <input
                    type="text"
                    name="discapacidad"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    value={parametros.discapacidad}
                    onChange={handleChange}
                    placeholder="Ej: Movilidad reducida"
                  />
                </div>
              </div>
            </div>

            {/* Sección central - Visualización (oculta en móvil) */}
            <div className="hidden lg:block bg-white p-4 rounded-lg space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {ultimoRegistro ? 'Último Registro' : 'Sin Registros'}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Peso Corporal</h3>
                  <div className="text-2xl sm:text-3xl font-bold mt-2">
                    {ultimoRegistro?.peso || '--'} kg
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 text-sm sm:text-base">Estatura</h3>
                  <div className="text-2xl sm:text-3xl font-bold mt-2">
                    {ultimoRegistro?.estatura || '--'} cm
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 text-sm sm:text-base">Nivel de Actividad</h3>
                  <div className="text-2xl sm:text-3xl font-bold mt-2">
                    {ultimoRegistro?.nivelActividadFisica || '--'}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className={`flex items-center ${ultimoRegistro?.nivelActividadFisica === 'Bajo' ? 'text-orange-600 font-medium' : 'text-gray-400'} text-xs sm:text-sm`}>
                      <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                      <span>Bajo</span>
                    </div>
                    <div className={`flex items-center ${ultimoRegistro?.nivelActividadFisica === 'Moderado' ? 'text-orange-600 font-medium' : 'text-gray-400'} text-xs sm:text-sm`}>
                      <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                      <span>Moderado</span>
                    </div>
                    <div className={`flex items-center ${ultimoRegistro?.nivelActividadFisica === 'Alto' ? 'text-orange-600 font-medium' : 'text-gray-400'} text-xs sm:text-sm`}>
                      <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                      <span>Alto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección derecha - Indicadores */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">Indicadores</h3>
              
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">IMC</label>
                  <div className={`p-2 sm:p-3 rounded-lg text-center font-bold text-base sm:text-lg ${imcActual.colorClass || 'bg-gray-100 text-gray-400'}`}>
                    {imcActual.valor || '--.--'} <span className="text-xs sm:text-sm font-normal">{imcActual.clasificacion}</span>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Bajo</span>
                    <span>Normal</span>
                    <span>Sobrepeso</span>
                    <span>Obesidad</span>
                  </div>
                  <div className="relative h-2 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full">
                    {imcActual.valor && (
                      <div 
                        className="absolute top-0 h-2.5 w-0.5 bg-gray-800 rounded-full -mt-0.5 transform -translate-x-1/2"
                        style={{
                          left: `${calcularPosicionIndicador(parseFloat(imcActual.valor))}%`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>15</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="col-span-1 lg:col-span-3 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
            {isEditing && (
                <button
                  type="button" // Evita que dispare el evento onSubmit
                  onClick={cancelarEdicion}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
                >
                  Cancelar
                </button>
              )}
              
              <button
                type="submit"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                {isEditing ? 'Actualizar' : 'Guardar'} Parámetros
              </button>
            </div>
          </div>

          {/* Historial de parámetros */}
          <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
                Historial de Parámetros
              </h3>
              
              {/* Filtro por fecha */}
              <div className="bg-gray-50 p-3 rounded-lg w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end w-full">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="inline mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Buscar por fecha</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="flex-1 px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <button
                        onClick={() => setFechaFiltro('')}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center text-xs sm:text-sm"
                        title="Limpiar filtro"
                      >
                        <FaSearch className="mr-1" />
                        {fechaFiltro ? 'Limpiar' : 'Todo'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {historial.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm sm:text-base">
                No hay registros históricos de parámetros
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatura</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMC</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historialFiltrado.map((registro) => {
                      const imc = calcularIMC(registro.peso, registro.estatura);
                      return (
                        <tr key={registro._id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(registro.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                            {registro.peso} kg
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {registro.estatura} cm
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${imc.colorClass}`}>
                              {imc.valor}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium space-x-1 sm:space-x-2">
                          <button
                              type="button" // Evita que dispare el evento onSubmit
                              onClick={() => cargarDatosParaEdicion(registro)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Editar"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => eliminarParametros(registro._id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Eliminar"
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </form>
  );
};

export default ParametrosSalud;