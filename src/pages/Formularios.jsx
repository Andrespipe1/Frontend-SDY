import React, { useState } from 'react';
import { FaClipboardList, FaUtensils } from 'react-icons/fa';
import Mensaje from '../components/Alerts/Mensaje';
import ParametrosSalud from './ParametrosSalud';
import FormularioComidas from './Comidas';

const Formularios = () => {
  const [activeTab, setActiveTab] = useState('salud');
  const [mensaje, setMensaje] = useState({});

  const mostrarMensaje = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto">
        {Object.keys(mensaje).length > 0 && (
          <div className="mb-4 sm:mb-6">
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          </div>
        )}

        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
            Seguimiento de Salud
          </h2>
          <p className="text-sm sm:text-base text-gray-500 text-center">
            Registro completo de parámetros y nutrición
          </p>
        </div>

        {/* Barra de tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTab('salud')}
                className={`flex items-center px-3 py-2 text-sm sm:text-base sm:px-4 sm:py-2 rounded-lg ${
                  activeTab === 'salud' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaClipboardList className="mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">Parámetros</span>
              </button>
              <button
                onClick={() => setActiveTab('comidas')}
                className={`flex items-center px-3 py-2 text-sm sm:text-base sm:px-4 sm:py-2 rounded-lg ${
                  activeTab === 'comidas' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaUtensils className="mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">Nutrición</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="mb-6 sm:mb-8">
          {activeTab === 'salud' ? <ParametrosSalud /> : <FormularioComidas key="comidas" />}
        </div>
      </div>
    </div>
  );
};

export default Formularios;