import React, { useEffect, useState } from 'react';
import Mensaje from '../components/Alerts/Mensaje';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';



const ParametrosSalud = () => {
  const [mensaje, setMensaje] = useState({});
  const [parametros, setParametros] = useState({
    peso: '',
    estatura: '',
    nivelActividadFisica: 'Bajo',
    enfermedad: '',
    discapacidad: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const token = localStorage.getItem('token');


const decodedToken = jwtDecode(token);
const pacienteId = decodedToken?.id;

  const mostrarMensaje = (mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

    useEffect(() => {
      const obtenerParametros = async () => {
        if (!pacienteId) return;
        
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Verifica si hay parámetros en la respuesta
          if (data.parametros && data.parametros.length > 0) {
            setParametros(data.parametros[0]); // Accede al primer elemento del array
            setIsEditing(true);
          } else {
            // Resetear a valores iniciales si no hay datos
            setParametros({
              peso: '',
              estatura: '',
              nivelActividadFisica: 'Bajo',
              enfermedad: '',
              discapacidad: ''
            });
            setIsEditing(false);
          }
        } catch (error) {
          console.error("Error obteniendo parámetros:", error);
          if (error.response?.status !== 404) {
            mostrarMensaje({
              respuesta: error.response?.data?.msg || 'Error al obtener parámetros',
              tipo: false
            });
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      obtenerParametros();
    }, [token, pacienteId]);

    const registrarParametros = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parametros-salud/registro`,
        { ...parametros, paciente: pacienteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Verifica si la respuesta contiene los parámetros
      if (data.parametros && data.parametros.length > 0) {
        setParametros(data.parametros[0]);
        setIsEditing(true);
        mostrarMensaje({ respuesta: 'Parámetros registrados correctamente', tipo: true });
      } else {
        throw new Error('No se recibieron datos del servidor');
      }
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
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`,
        parametros,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Maneja la respuesta actualizada
      if (data.parametros && data.parametros.length > 0) {
        setParametros(data.parametros[0]);
        mostrarMensaje({ respuesta: data.msg || 'Datos actualizados correctamente', tipo: true });
      }
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al actualizar los datos',
        tipo: false
      });
    }
  };

  const eliminarParametros = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/parametros/${pacienteId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      mostrarMensaje({ respuesta: data.msg || 'Parámetros eliminados correctamente', tipo: true });
      setParametros({
        peso: '',
        estatura: '',
        nivelActividadFisica: 'Bajo',
        enfermedad: '',
        discapacidad: ''
      });
      setIsEditing(false);
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al eliminar los parámetros',
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

  const calcularIMC = () => {
    if (parametros.peso && parametros.estatura) {
      const alturaEnMetros = parametros.estatura / 100;
      const imc = (parametros.peso / (alturaEnMetros * alturaEnMetros)).toFixed(1);
      
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

  const imcData = calcularIMC();

  const handleChange = (e) => {
    setParametros({
      ...parametros,
      [e.target.name]: e.target.value
    });
  };

  const calcularPosicionIndicador = () => {
    if (!imcData.valor) return 0;
    const imcValue = parseFloat(imcData.valor);
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
    <form onSubmit={handleSubmit}>
      {mensaje.respuesta && (
        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
      )}
      
      {isLoading ? (
        <div className="p-6 text-center">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 bg-white rounded-xl shadow-md">
          {/* Sección izquierda - Formulario */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Datos Corporales</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="peso"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={parametros.peso}
                    onChange={handleChange}
                    placeholder="70.5"
                    required
                    min="0"
                    step="0.1"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">kg</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estatura (cm)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="estatura"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={parametros.estatura}
                    onChange={handleChange}
                    placeholder="175"
                    required
                    min="0"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">cm</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Actividad Física</label>
                <select
                  name="nivelActividadFisica"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={parametros.discapacidad}
                  onChange={handleChange}
                  placeholder="Ej: Movilidad reducida"
                />
              </div>
            </div>
          </div>

{/* Sección central - Visualización */}
<div className="bg-white p-6 rounded-xl shadow-md space-y-6">
  {/* Encabezado */}
  <h2 className="text-2xl font-bold text-gray-800">Progreso de Salud</h2>

  {/* Tarjetas de métricas */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Peso */}
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-semibold text-blue-800">Peso Corporal</h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-3xl font-bold">{parametros.peso || '--'} kg</span>
        <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {imcData.clasificacion || 'Calcula tu IMC'}
        </div>
      </div>
      <div className="mt-2">
        <div className="h-2 bg-blue-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full" 
            style={{ width: `${Math.min((parametros.peso/150)*100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 kg</span>
          <span>150 kg</span>
        </div>
      </div>
    </div>

    {/* Estatura */}
    <div className="bg-green-50 p-4 rounded-lg">
      <h3 className="font-semibold text-green-800">Estatura</h3>
      <div className="text-3xl font-bold mt-2">
        {parametros.estatura || '--'} cm
      </div>
      <div className="mt-2">
        <div className="h-2 bg-green-200 rounded-full">
          <div 
            className="h-full bg-green-600 rounded-full" 
            style={{ width: `${Math.min((parametros.estatura/250)*100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 cm</span>
          <span>250 cm</span>
        </div>
      </div>
    </div>


    {/* Actividad Física */}
    <div className="bg-orange-50 p-4 rounded-lg">
      <h3 className="font-semibold text-orange-800">Nivel de Actividad</h3>
      <div className="text-3xl font-bold mt-2">
        {parametros.nivelActividadFisica || '--'}
      </div>
      <div className="mt-3 space-y-2">
        <div className={`flex items-center ${parametros.nivelActividadFisica === 'Bajo' ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
          <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
          <span>Bajo</span>
        </div>
        <div className={`flex items-center ${parametros.nivelActividadFisica === 'Moderado' ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
          <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
          <span>Moderado</span>
        </div>
        <div className={`flex items-center ${parametros.nivelActividadFisica === 'Alto' ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
          <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
          <span>Alto</span>
        </div>
      </div>
    </div>
  </div>

</div>

          {/* Sección derecha - Resultados */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Resultados</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Índice de Masa Corporal</label>
                <div className={`p-3 rounded-lg text-center font-bold text-lg ${imcData.colorClass || 'bg-gray-100 text-gray-400'}`}>
                  {imcData.valor || '--.--'} <span className="text-sm font-normal">{imcData.clasificacion}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Bajo peso</span>
                  <span>Normal</span>
                  <span>Sobrepeso</span>
                  <span>Obesidad</span>
                </div>
                <div className="relative h-2.5 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full">
                  {imcData.valor && (
                    <div 
                      className="absolute top-0 h-3 w-0.5 bg-gray-800 rounded-full -mt-0.5 transform -translate-x-1/2"
                      style={{
                        left: `${calcularPosicionIndicador()}%`
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
          <div className="col-span-3 flex justify-between">
            {isEditing && (
              <button
                type="button"
                onClick={eliminarParametros}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Eliminar Parámetros
              </button>
            )}
            
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto"
            >
              {isEditing ? 'Actualizar' : 'Guardar'} Parámetros
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ParametrosSalud;