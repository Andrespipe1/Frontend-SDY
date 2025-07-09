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
  const [editingComida, setEditingComida] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const pacienteId = decodedToken?.id;

  const mostrarMensaje = (mensaje) => {
    setMensaje(mensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  const handleCloseMensaje = () => {
    setMensaje({});
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      if (!pacienteId) {
        setIsLoading(false);
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

    // Validar que no haya más de 3 dígitos consecutivos
    if (/\d{4,}/.test(descripcion)) {
      mostrarMensaje({
        respuesta: 'La descripción no puede contener más de 3 dígitos consecutivos.',
        tipo: false,
      });
      return;
    }

    if (!descripcion || descripcion.length < 10 || descripcion.length > 200) {
      mostrarMensaje({
        respuesta: 'La descripción debe tener entre 10 y 200 caracteres.',
        tipo: false,
      });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comidas-paciente/registro`,
        {
          tipoComida: tipoComida.charAt(0).toUpperCase() + tipoComida.slice(1),
          descripcion,
          paciente: pacienteId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje({
        respuesta: 'Comida registrada exitosamente',
        tipo: true
      });

      setComidasInput({
        ...comidasInput,
        [tipoComida]: '',
      });

      // Recargar historial después de guardar
      recargarHistorial();
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

  const iniciarEdicionComida = (comida) => {
    setEditingComida({
      id: comida._id,
      tipoComida: comida.tipoComida.toLowerCase(),
      descripcion: comida.descripcion
    });
  };

  const cancelarEdicion = () => {
    setEditingComida(null);
  };

  const actualizarComida = async () => {
    if (!editingComida?.descripcion) {
      mostrarMensaje({ respuesta: 'Por favor ingresa una descripción', tipo: false });
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/actualizar-comida/${editingComida.id}`,
        {
          id: editingComida.id,
          descripcion: editingComida.descripcion
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      mostrarMensaje({
        respuesta: 'Comida actualizada exitosamente',
        tipo: true
      });

      setEditingComida(null);
      recargarHistorial();
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al actualizar la comida',
        tipo: false
      });
    }
  };

  const comidasFiltradas = apiResponse.comidas.filter(comida => {
    if (!fechaFiltro) return true;

    const fechaComida = new Date(comida.createdAt);
    const fechaComidaStr = fechaComida.toLocaleDateString('en-CA');

    return fechaComidaStr === fechaFiltro;
  });

  const recargarHistorial = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/comidas/${pacienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiResponse({
        paciente: data.paciente,
        comidas: data.comidas || []
      });
      mostrarMensaje({ respuesta: 'Historial recargado', tipo: true });
    } catch (error) {
      console.error('Error recargando datos:', error);
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al recargar datos',
        tipo: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const permitirSoloTexto = (e) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d]*$/; // Permitir letras, números y espacios
    const value = e.target.value;

    // Validar que no haya más de 3 dígitos consecutivos
    const tieneDemasiadosNumeros = /\d{4,}/.test(value);

    if (!regex.test(e.key) || tieneDemasiadosNumeros) {
      e.preventDefault();
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

  const getIconForTipoComida = (tipoComida) => {
    switch (tipoComida.toLowerCase()) {
      case 'desayuno':
        return <FaCoffee className="text-amber-500 mr-2" />;
      case 'almuerzo':
        return <FaUtensils className="text-blue-500 mr-2" />;
      case 'cena':
        return <FaHamburger className="text-purple-500 mr-2" />;
      case 'snack':
        return <FaIceCream className="text-pink-500 mr-2" />;
      default:
        return <FaUtensils className="text-gray-500 mr-2" />;
    }
  };

  return (
    <>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        message="¿Estás seguro de que deseas eliminar esta comida?"
      />

      <div className="pb-4 sm:pb-8">
        {mensaje.respuesta && <Mensaje tipo={mensaje.tipo} onClose={handleCloseMensaje}>{mensaje.respuesta}</Mensaje>}

        {/* Formulario de registro de comidas */}
        <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
            Registro de Alimentación
            {apiResponse.paciente && (
              <span className="text-blue-600 ml-2">
                - {apiResponse.paciente.nombre} {apiResponse.paciente.apellido}
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comidasConfig.map((comida, index) => (
              <div key={index} className="border-l-4 border-blue-100 pl-4">
                <div className="flex items-center mb-2">
                  <div className="mr-3 p-2 bg-gray-50 rounded-full">
                    {comida.icon}
                  </div>
                  <label className="text-sm font-medium text-gray-700">{comida.label}</label>
                </div>

                {editingComida?.tipoComida === comida.name ? (
                  <div className="relative">
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows="3"
                      value={editingComida.descripcion}
                      onChange={(e) => setEditingComida({
                        ...editingComida,
                        descripcion: e.target.value
                      })}
                      onKeyPress={permitirSoloTexto}
                      placeholder={comida.placeholder}
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        type="button"
                        className="text-xs flex items-center text-red-600 hover:text-red-800 px-3 py-1 bg-red-50 rounded cursor-pointer"
                        onClick={cancelarEdicion}
                      >
                        <FaTimes className="mr-1" size={10} />
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="text-xs flex items-center text-green-600 hover:text-green-800 px-3 py-1 bg-green-50 rounded cursor-pointer"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows="3"
                      value={comidasInput[comida.name]}
                      onChange={handleChange}
                      onKeyPress={permitirSoloTexto}
                      placeholder={comida.placeholder}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        className="text-xs flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded cursor-pointer"
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
        </div>

        {/* Historial de comidas - Estilo similar a parámetros */}
        <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
              Historial de Comidas
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
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center text-xs sm:text-sm cursor-pointer"
                      title="Limpiar filtro"
                      type="button"
                    >
                      <FaSearch className="mr-1" />
                      {fechaFiltro ? 'Limpiar' : 'Todo'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
                />
                <motion.p
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  className="mt-4 text-sm font-semibold text-gray-700"
                >
                  Cargando tus comidas...
                </motion.p>
              </motion.div>
            </div>
          ) : comidasFiltradas.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm sm:text-base">
              {apiResponse.comidas.length === 0
                ? 'No hay comidas registradas'
                : `No hay comidas registradas para la fecha ${fechaFiltro.split('-').reverse().join('/')}`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comidasFiltradas.map((comida) => (
                    <tr key={comida._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {getIconForTipoComida(comida.tipoComida)}
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            {comida.tipoComida}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-500 max-w-xs">
                        <div className="line-clamp-2">
                          {comida.descripcion}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {new Date(comida.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm font-medium space-x-1 sm:space-x-2">
                        <button
                          type="button"
                          onClick={() => iniciarEdicionComida(comida)}
                          className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer"
                          title="Editar"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(comida._id)}
                          className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
                          title="Eliminar"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormularioComidas;