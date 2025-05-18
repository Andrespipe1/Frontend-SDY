import React, { useState, useEffect } from 'react';
import { FaUtensils, FaCoffee, FaHamburger, FaIceCream, FaPlus, FaTrash, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Mensaje from '../components/Alerts/Mensaje';

const FormularioComidas = () => {
  const [comidasInput, setComidasInput] = useState({
    desayuno: '',
    almuerzo: '',
    cena: '',
    snacks: ''
  });
  const [mensaje, setMensaje] = useState({});
  const [apiResponse, setApiResponse] = useState({
    paciente: null,
    comidas: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const pacienteId = decodedToken?.id;

  const mostrarMensaje = (mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  // Obtener datos del paciente y sus comidas
  useEffect(() => {
    const obtenerDatos = async () => {
      if (!pacienteId) return;
      
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/paciente/comidas/${pacienteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setApiResponse({
          paciente: data.paciente,
          comidas: data.comidas || [] // Asegurar que siempre sea un array
        });
      } catch (error) {
        console.error('Error obteniendo datos:', error);
        mostrarMensaje({
          respuesta: error.response?.data?.msg || 'Error al obtener datos',
          tipo: false
        });
        setApiResponse({
          paciente: null,
          comidas: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    obtenerDatos();
  }, [token, pacienteId]);

  const handleChange = (e) => {
    setComidasInput({
      ...comidasInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitComida = async (tipoComida) => {
    if (!comidasInput[tipoComida]) {
      mostrarMensaje({ respuesta: 'Por favor ingresa una descripción', tipo: false });
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comidas/registro`,
        { 
          tipoComida: tipoComida.charAt(0).toUpperCase() + tipoComida.slice(1),
          descripcion: comidasInput[tipoComida],
          paciente: pacienteId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje({ respuesta: 'Comida registrada exitosamente', tipo: true });
      
      // Actualizar el estado con la nueva comida
      setApiResponse(prev => ({
        ...prev,
        comidas: [data, ...prev.comidas]
      }));
      
      // Limpiar el input
      setComidasInput({
        ...comidasInput,
        [tipoComida]: ''
      });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al registrar la comida',
        tipo: false
      });
    }
  };

  const eliminarComida = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/comidas/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      mostrarMensaje({ respuesta: 'Comida eliminada exitosamente', tipo: true });
      
      // Actualizar el estado eliminando la comida
      setApiResponse(prev => ({
        ...prev,
        comidas: prev.comidas.filter(comida => comida._id !== id)
      }));
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al eliminar la comida',
        tipo: false
      });
    }
  };
  // Función para filtrar comidas por un día específico
  const comidasFiltradas = apiResponse.comidas.filter(comida => {
    if (!fechaFiltro) return true;
    
    const fechaComida = new Date(comida.createdAt).toISOString().split('T')[0];
    return fechaComida === fechaFiltro;
  });

  const comidasConfig = [
    {
      name: 'desayuno',
      label: 'Desayuno',
      icon: <FaCoffee className="text-amber-500" />,
      placeholder: 'Ej: Café con leche, tostadas integrales con aguacate...'
    },
    {
      name: 'almuerzo',
      label: 'Almuerzo',
      icon: <FaUtensils className="text-blue-500" />,
      placeholder: 'Ej: Pechuga a la plancha con arroz integral y ensalada...'
    },
    {
      name: 'cena',
      label: 'Cena',
      icon: <FaHamburger className="text-purple-500" />,
      placeholder: 'Ej: Crema de calabaza, filete de merluza con espárragos...'
    },
    {
      name: 'snacks',
      label: 'Snacks',
      icon: <FaIceCream className="text-pink-500" />,
      placeholder: 'Ej: Frutos secos, yogur griego con frutas...'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        {mensaje.respuesta && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
        
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Registro de Alimentación
          {apiResponse.paciente && (
            <span className="text-blue-600 ml-2">
              - {apiResponse.paciente.nombre} {apiResponse.paciente.apellido}
            </span>
          )}
        </h3>
        
        <div className="space-y-6">
          {comidasConfig.map((comida, index) => (
            <div key={index} className="border-l-4 border-blue-100 pl-4">
              <div className="flex items-center mb-2">
                <div className="mr-3 p-2 bg-gray-50 rounded-full">
                  {comida.icon}
                </div>
                <label className="text-sm font-medium text-gray-700">{comida.label}</label>
              </div>
              <textarea
                name={comida.name}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={comidasInput[comida.name]}
                onChange={handleChange}
                placeholder={comida.placeholder}
              />
              <div className="flex justify-end mt-1">
                <button 
                  type="button"
                  className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => handleSubmitComida(comida.name)}
                >
                  <FaPlus className="mr-1" size={10} />
                  Guardar {comida.label}
                </button>
              </div>
            </div>
          ))}
        </div>


        {/* Historial de comidas con filtro simple */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Historial de Comidas</h4>
          </div>
          
          {/* Filtro por día único */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaCalendarAlt className="inline mr-2" />
                  Buscar comidas por día
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
          
          {isLoading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : comidasFiltradas.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {apiResponse.comidas.length === 0 
                ? 'No hay comidas registradas' 
                : fechaFiltro
                  ? `No hay comidas registradas el ${new Date(fechaFiltro).toLocaleDateString('es-ES')}`
                  : 'No hay comidas registradas'}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-500 mb-2">
                Mostrando {comidasFiltradas.length} comida(s) 
                {fechaFiltro && ` del ${new Date(fechaFiltro).toLocaleDateString('es-ES')}`}
              </div>
              {comidasFiltradas.map((comida) => (
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
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => eliminarComida(comida._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioComidas;