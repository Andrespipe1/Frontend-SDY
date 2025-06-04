import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Mensaje from '../components/Alerts/Mensaje';
import TextoExpandible from '../components/TextoExpandible';
const Recomendaciones = () => {
  const [parametros, setParametros] = useState(null);
  const [comidas, setComidas] = useState([]);
  const [ultimaRecomendacionParametros, setUltimaRecomendacionParametros] = useState(null);
  const [ultimaRecomendacionComidas, setUltimaRecomendacionComidas] = useState(null);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [mensaje, setMensaje] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingParams, setIsGeneratingParams] = useState(false);
  const [isGeneratingMeals, setIsGeneratingMeals] = useState(false);
  const token = localStorage.getItem('token');
  const pacienteId = JSON.parse(atob(token.split('.')[1])).id;

  const mostrarMensaje = (mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener el último registro de parámetros
        const { data: parametrosData } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setParametros(parametrosData.parametros?.at(-1) || null);

        // Obtener las comidas ordenadas por fecha
        const { data: comidasData } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/paciente/comidas/${pacienteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const comidasOrdenadas = comidasData.comidas.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const ultimoDia = comidasOrdenadas[0]?.createdAt.split('T')[0];
        const comidasUltimoDia = comidasOrdenadas.filter(
          (comida) => comida.createdAt.split('T')[0] === ultimoDia
        );
        setComidas(comidasUltimoDia);

        // Obtener las recomendaciones
        const { data: recomendacionesData } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/obtener-recomendaciones/${pacienteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecomendaciones(recomendacionesData.recomendaciones);
        setUltimaRecomendacionParametros(
          recomendacionesData.recomendaciones.find((r) => r.tipo === 'parametros') || null
        );
        setUltimaRecomendacionComidas(
          recomendacionesData.recomendaciones.find((r) => r.tipo === 'comidas') || null
        );
      } catch (error) {
        console.error('Error al obtener datos:', error);
        mostrarMensaje({
          respuesta: error.response?.data?.msg || 'Error al obtener datos',
          tipo: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, [pacienteId, token, isGeneratingParams, isGeneratingMeals]);

  const generarRecomendacionesParametros = async () => {
    setIsGeneratingParams(true);
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/recomendacionesParametros/${pacienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje({ respuesta: 'Recomendaciones generadas exitosamente.', tipo: true });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al generar recomendaciones.',
        tipo: false,
      });
    } finally {
      setTimeout(() => setIsGeneratingParams(false), 1000);
    }
  };

  const generarRecomendacionesComidas = async () => {
    setIsGeneratingMeals(true);
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/recomendacionesComidas/${pacienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje({ respuesta: 'Recomendaciones de comidas generadas exitosamente.', tipo: true });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al generar recomendaciones de comidas.',
        tipo: false,
      });
    } finally {
      setTimeout(() => setIsGeneratingMeals(false), 1000);
    }
  };

  if (isLoading) {
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
    <div className="p-6 lg:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

        {mensaje.respuesta && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          </motion.div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">Panel de Recomendaciones</h2>


      {/* Sección de Parámetros */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
      >
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            Últimos Parámetros
          </h2>
          
          {parametros ? (
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Peso:</span>
                <span className="font-semibold">{parametros.peso} kg</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Estatura:</span>
                <span className="font-semibold">{parametros.estatura} cm</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Actividad Física:</span>
                <span className="font-semibold capitalize">{parametros.nivelActividadFisica}</span>
              </div>
              {parametros.enfermedad && (
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">Enfermedad:</span>
                  <span className="font-semibold">{parametros.enfermedad}</span>
                </div>
              )}
              {parametros.discapacidad && (
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">Discapacidad:</span>
                  <span className="font-semibold">{parametros.discapacidad}</span>
                </div>
              )}
              
              <button
                onClick={generarRecomendacionesParametros}
                disabled={isGeneratingParams}
                className={`mt-4 w-full px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 ${
                  isGeneratingParams ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium`}
              >
                {isGeneratingParams ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generar Recomendaciones</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700">
              <p>No hay parámetros registrados.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-purple-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            Recomendación de Parámetros
          </h2>
          
          {ultimaRecomendacionParametros ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-purple-50 rounded-lg"
            >
              <TextoExpandible texto={ultimaRecomendacionParametros.contenido} />
              <p className="text-xs text-gray-500 mt-3">
                Generado el: {new Date(ultimaRecomendacionParametros.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ) : (
            <div className="p-4 bg-gray-100 rounded-lg text-gray-600">
              <p>No hay recomendaciones de parámetros disponibles.</p>
              <p className="text-sm mt-2">Haz clic en "Generar Recomendaciones" para obtener sugerencias personalizadas.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Sección de Comidas */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
      >
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-green-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            Comidas del Último Día
          </h2>
          
          {comidas.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {comidas.map((comida) => (
                  <motion.div 
                    key={comida._id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-green-50 rounded-lg shadow-sm border border-green-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">{comida.tipoComida}</h3>
                        <p className="text-gray-600 mt-1">{comida.descripcion}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        {new Date(comida.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button
                onClick={generarRecomendacionesComidas}
                disabled={isGeneratingMeals}
                className={`w-full px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 ${
                  isGeneratingMeals ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } text-white font-medium`}
              >
                {isGeneratingMeals ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analizando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Calcular Calorías y Recomendaciones</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700">
              <p>No hay comidas registradas para el último día.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-orange-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </span>
            Recomendación de Comidas
            
          </h2>
          <p className='p-2 text-gray-500'>Para mejores resultados ingrese porciones en sus registros de comida</p>
          {ultimaRecomendacionComidas ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {Object.entries(JSON.parse(ultimaRecomendacionComidas.contenido)).map(([tipoComida, detalle]) => (
                <div key={tipoComida} className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-gray-700 font-medium capitalize flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {tipoComida}:
                  </p>
                  <TextoExpandible texto={detalle} />
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-3">
                Generado el: {new Date(ultimaRecomendacionComidas.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ) : (
            <div className="p-4 bg-gray-100 rounded-lg text-gray-600">
              <p>No hay recomendaciones de comidas disponibles.</p>
              <p className="text-sm mt-2">Haz clic en "Calcular Calorías" para obtener sugerencias nutricionales.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Recomendaciones;

