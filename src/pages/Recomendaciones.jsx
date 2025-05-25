import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Mensaje from '../components/Alerts/Mensaje';

const Recomendaciones = () => {
  const [parametros, setParametros] = useState(null);
  const [comidas, setComidas] = useState([]);
  const [ultimaRecomendacionParametros, setUltimaRecomendacionParametros] = useState(null);
  const [ultimaRecomendacionComidas, setUltimaRecomendacionComidas] = useState(null);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [mensaje, setMensaje] = useState({});
  const [isLoading, setIsLoading] = useState(true);
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
  }, [pacienteId, token]);

  const generarRecomendacionesParametros = async () => {
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
    }
  };

  const generarRecomendacionesComidas = async () => {
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
    }
  };

  if (isLoading) {
    return <div className="text-center py-6 text-lg font-semibold">Cargando...</div>;
  }

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">
      {mensaje.respuesta && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Panel de Recomendaciones</h1>

      {/* Sección de Parámetros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Últimos Parámetros</h2>
          {parametros ? (
            <>
              <p><strong>Peso:</strong> {parametros.peso} kg</p>
              <p><strong>Estatura:</strong> {parametros.estatura} cm</p>
              <p><strong>Nivel de Actividad Física:</strong> {parametros.nivelActividadFisica}</p>
              <p><strong>Enfermedad:</strong> {parametros.enfermedad || 'N/A'}</p>
              <p><strong>Discapacidad:</strong> {parametros.discapacidad || 'N/A'}</p>
              <button
                onClick={generarRecomendacionesParametros}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Generar Recomendaciones
              </button>
            </>
          ) : (
            <p>No hay parámetros registrados.</p>
          )}
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recomendación de Parámetros</h2>
          {ultimaRecomendacionParametros ? (
            <p className="text-gray-600 mt-2">{ultimaRecomendacionParametros.contenido}</p>
          ) : (
            <p className="text-gray-500">No hay recomendaciones de parámetros.</p>
          )}
        </div>
      </div>

      {/* Sección de Comidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comidas del Último Día</h2>
          {comidas.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comidas.map((comida) => (
                  <div key={comida._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">{comida.tipoComida}</h3>
                    <p className="text-gray-600 mt-2">{comida.descripcion}</p>
                    <p className="text-xs text-gray-500 mt-1">Registrado el: {new Date(comida.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={generarRecomendacionesComidas}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Calcular Calorías
              </button>
            </>
          ) : (
            <p>No hay comidas registradas para el último día.</p>
          )}
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recomendación de Comidas</h2>
          {ultimaRecomendacionComidas ? (
            <div className="mt-2 space-y-2">
              {Object.entries(JSON.parse(ultimaRecomendacionComidas.contenido)).map(([tipoComida, detalle]) => (
                <div key={tipoComida}>
                  <p className="text-gray-700 font-medium capitalize">{tipoComida}:</p>
                  <p className="text-gray-600 whitespace-pre-line">{detalle}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay recomendaciones de comidas.</p>
          )}
        </div>
      </div>

      {/* Historial */}
      {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Recomendaciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recomendaciones.map((recomendacion) => (
          <div key={recomendacion._id} className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              {recomendacion.tipo === 'parametros' ? 'Parámetros' : 'Comidas'}
            </h3>
            <p className="text-gray-600 mt-2">{recomendacion.contenido}</p>
            <p className="text-xs text-gray-500 mt-1">Generado el: {new Date(recomendacion.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Recomendaciones;