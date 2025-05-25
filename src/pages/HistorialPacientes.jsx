import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Mensaje from '../components/Alerts/Mensaje';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';

const HistorialPaciente = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('parametros');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [pacienteInfo, setPacienteInfo] = useState(null);

  const token = localStorage.getItem('token');

  const mostrarMensaje = (mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setIsLoading(true);
        
        // 1. Obtener información del paciente
        const { data: pacienteData } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/listar-pacientes/${pacienteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 1000
          }
        );

        console.log('Respuesta del paciente:', pacienteData); // Debug
        
        if (!pacienteData?.paciente) {
          throw new Error('Estructura de respuesta inesperada');
        }

        setPacienteInfo(pacienteData.paciente);

        // 2. Obtener historial según la pestaña activa
        const endpoint = activeTab === 'parametros'
          ? `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`
          : `${import.meta.env.VITE_BACKEND_URL}/paciente/comidas/${pacienteId}`;

        const { data: historialData } = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 1000
        });

        console.log('Respuesta del historial:', historialData); // Debug

        let datos = activeTab === 'parametros'
          ? historialData?.parametros || []
          : historialData?.comidas || [];

        // Aplicar filtro por fecha
        if (fechaFiltro) {
          datos = datos.filter(item => {
            try {
              const fechaItem = new Date(item.createdAt).toISOString().split('T')[0];
              return fechaItem === fechaFiltro;
            } catch (e) {
              console.error('Error procesando fecha:', e);
              return false;
            }
          });
        }

        setHistorial(datos);

      } catch (error) {
        console.error('Error completo:', error);
        mostrarMensaje({
          respuesta: error.response?.data?.msg || 
                    error.message || 
                    'Error al cargar los datos',
          tipo: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (pacienteId) {
      obtenerDatos();
    }
  }, [pacienteId, token, activeTab, fechaFiltro]);

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

  return (
    <div className="container mx-auto p-4">
      {/* Botón de regreso */}
      <button 
        onClick={() => navigate('/dashboard_Nutri/listarPacientes')}
        className="flex items-center text-blue-600 mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Volver
      </button>

      {/* Mostrar mensajes de error */}
      {mensaje.respuesta && (
        <div className="mb-4">
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
        </div>
      )}

      {/* Contenido principal */}
      {isLoading ? (
        <div className="text-center py-8">Cargando datos del paciente...</div>
      ) : pacienteInfo ? (
        <>
          {/* Información del paciente */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {pacienteInfo.nombre.charAt(0)}{pacienteInfo.apellido.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {pacienteInfo.nombre} {pacienteInfo.apellido}
                </h1>
                <p className="text-gray-600">{pacienteInfo.edad} años</p>
              </div>
            </div>
          </div>

          {/* Pestañas de historial */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('parametros')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'parametros'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Parámetros de Salud
              </button>
              <button
                onClick={() => setActiveTab('comidas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'comidas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Registro de Comidas
              </button>
            </nav>
          </div>

          {/* Filtro por fecha */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaCalendarAlt className="inline mr-2" />
                  Filtrar por fecha
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={fechaFiltro}
                    onChange={(e) => setFechaFiltro(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <button
                    onClick={() => setFechaFiltro('')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                    title="Limpiar filtro"
                  >
                    <FaSearch className="mr-1" />
                    {fechaFiltro ? 'Limpiar' : 'Ver todo'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de las pestañas */}
          {activeTab === 'parametros' ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Parámetros</h2>
              
              {historial.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay registros de parámetros para este paciente
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatura</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel Actividad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMC</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historial.map((registro) => {
                        const imc = calcularIMC(registro.peso, registro.estatura);
                        return (
                          <tr key={registro._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(registro.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {registro.peso} kg
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {registro.estatura} cm
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {registro.nivelActividadFisica}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${imc.colorClass}`}>
                                {imc.valor} ({imc.clasificacion})
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Comidas</h2>
              
              {historial.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay registros de comidas para este paciente
                </div>
              ) : (
                <div className="space-y-4">
                  {historial.map((comida) => (
                    <div key={comida._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-blue-600">{comida.tipoComida}</span>
                          <p className="text-gray-700 mt-1">{comida.descripcion}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(comida.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-red-500">
          No se encontraron datos para el paciente con ID: {pacienteId}
        </div>
      )}
    </div>
  );
};

export default HistorialPaciente;