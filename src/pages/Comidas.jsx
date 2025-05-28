import React, { useState, useEffect } from 'react';
import { FaUtensils, FaCoffee, FaHamburger, FaIceCream, FaPlus, FaTrash, FaCalendarAlt, FaSearch, FaEdit, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Mensaje from '../components/Alerts/Mensaje';
import ConfirmDeleteModal from '../components/Modals/ConfirmDeleteModal';
import { motion } from 'framer-motion';
const FormularioComidas = () => {
  const [comidasInput, setComidasInput] = useState({
    desayuno: '',
    almuerzo: '',
    cena: '',
    snack: ''
  });
  const [mensaje, setMensaje] = useState({});
  const [apiResponse, setApiResponse] = useState({
    paciente: null,
    comidas: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [editingComida, setEditingComida] = useState(null); // Estado para controlar qué comida se está editando
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controlar la visibilidad del modal de eliminación
  const [idToDelete, setIdToDelete] = useState(null); // ID de la comida a eliminar
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
      if (!pacienteId) {
        setIsLoading(false); // <-- Asegúrate de apagar el loading
        return;
      }
  
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/paciente/comidas/${pacienteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setApiResponse({
          paciente: data.paciente,
          comidas: data.comidas || []
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
    const descripcion = comidasInput[tipoComida];
  
    // Validar longitud mínima y máxima
    if (!descripcion || descripcion.length < 10 || descripcion.length > 200) {
      mostrarMensaje({
        respuesta: 'La descripción debe tener entre 10 y 200 caracteres.',
        tipo: false,
      });
      return;
    }
  
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comidas-paciente/registro`,
        {
          tipoComida: tipoComida.charAt(0).toUpperCase() + tipoComida.slice(1),
          descripcion,
          paciente: pacienteId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      mostrarMensaje({ respuesta: 'Comida registrada exitosamente', tipo: true });
  
      // Actualizar el estado con la nueva comida - CORRECCIÓN AQUÍ
      setApiResponse((prev) => ({
        ...prev,
        comidas: [data.comida || data, ...prev.comidas], // Asegurarse de obtener la comida correcta
      }));
  
      // Limpiar el input
      setComidasInput({
        ...comidasInput,
        [tipoComida]: '',
      });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al registrar la comida',
        tipo: false,
      });
    }
  };

  const openDeleteModal = (id) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIdToDelete(null);
    setIsDeleteModalOpen(false);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/eliminar-comida/${idToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mostrarMensaje({ respuesta: 'Comida eliminada exitosamente', tipo: true });
      setApiResponse((prev) => ({
        ...prev,
        comidas: prev.comidas.filter((comida) => comida._id !== idToDelete),
      }));
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al eliminar la comida',
        tipo: false,
      });
    } finally {
      closeDeleteModal();
    }
  };

  // Función para iniciar la edición de una comida
  const iniciarEdicionComida = (comida) => {
    setEditingComida({
      id: comida._id,
      tipoComida: comida.tipoComida.toLowerCase(),
      descripcion: comida.descripcion
    });
  };

  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setEditingComida(null);
  };

  // Función para actualizar una comida
  const actualizarComida = async () => {
    if (!editingComida?.descripcion) {
      mostrarMensaje({ respuesta: 'Por favor ingresa una descripción', tipo: false });
      return;
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar-comida/${editingComida.id}`,
        { 
          id: editingComida.id,
          descripcion: editingComida.descripcion
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje({ respuesta: 'Comida actualizada exitosamente', tipo: true });
      
      // Actualizar el estado con la comida actualizada
      setApiResponse(prev => ({
        ...prev,
        comidas: prev.comidas.map(comida => 
          comida._id === editingComida.id ? data : comida
        )
      }));
      
      // Limpiar el estado de edición
      setEditingComida(null);
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al actualizar la comida',
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
  const permitirSoloTexto = (e) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Permite letras, espacios y caracteres acentuados
    if (!regex.test(e.key)) {
      e.preventDefault(); // Evita que se escriban caracteres no permitidos
    }
  };
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
      name: 'snack',
      label: 'Snacks',
      icon: <FaIceCream className="text-pink-500" />,
      placeholder: 'Ej: Frutos secos, yogur griego con frutas...'
    }
  ];

  return (
    <>
    <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        message="¿Estás seguro de que deseas eliminar esta comida?"
      />
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
              
              {/* Mostrar textarea normal o el de edición según el estado */}
              {editingComida?.tipoComida === comida.name ? (
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={editingComida.descripcion}
                    onChange={(e) => setEditingComida({
                      ...editingComida,
                      descripcion: e.target.value
                    })}
                    onKeyPress={permitirSoloTexto}
                    placeholder={comida.placeholder}
                  />
                  <div className="flex justify-between mt-1">
                    <button 
                      type="button"
                      className="text-xs flex items-center text-red-600 hover:text-red-800"
                      onClick={cancelarEdicion}
                    >
                      <FaTimes className="mr-1" size={10} />
                      Cancelar
                    </button>
                    <button 
                      type="button"
                      className="text-xs flex items-center text-green-600 hover:text-green-800"
                      onClick={actualizarComida}
                    >
                      <FaEdit className="mr-1" size={10} />
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    name={comida.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={comidasInput[comida.name]}
                    onChange={handleChange}
                    onKeyPress={permitirSoloTexto}
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
                </>
              )}
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
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
              />
              <motion.p 
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                className="mt-4 text-lg font-semibold text-gray-700"
              >
                Cargando tus parámetros de salud...
              </motion.p>
            </motion.div>
            </div>
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
                        {new Date(comida.createdAt || new Date()).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => iniciarEdicionComida(comida)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(comida._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default FormularioComidas;