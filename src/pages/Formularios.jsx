import React, { useState } from 'react';
import {  FaClipboardList, FaUtensils } from 'react-icons/fa';
import Mensaje from '../components/Alerts/Mensaje';
import ParametrosSalud from './ParametrosSalud';
import FormularioComidas from './Comidas';

const Formularios = () => {
  const [activeTab, setActiveTab] = useState('salud');
  const [mensaje, setMensaje] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const mostrarMensaje = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  const handleSubmit = () => {
    
    mostrarMensaje({
      respuesta: 'Datos guardados correctamente',
      tipo: true
    });
  };

  return (
    <div className="min-h-full px-4 py-6 lg:px-8 bg-gray-50">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto">
        {Object.keys(mensaje).length > 0 && (
          <div className="mb-6">
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          
          <h2 className="text-2xl font-bold text-gray-800">Seguimiento de Salud</h2>
          <p className="text-gray-500">Registro completo de parámetros y nutrición</p>
        </div>

        {/* Barra de búsqueda y tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


            <div className="flex border-b md:border-none overflow-x-auto">
              <button
                onClick={() => setActiveTab('salud')}
                className={`flex items-center px-4 py-2 mr-2 rounded-t-lg md:rounded-lg ${activeTab === 'salud' ? 'bg-blue-100 text-blue-700 border-b-2 md:border-b-0 border-blue-500' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaClipboardList className="mr-2" />
                Parámetros
              </button>
              <button
                onClick={() => setActiveTab('comidas')}
                className={`flex items-center px-4 py-2 rounded-t-lg md:rounded-lg ${activeTab === 'comidas' ? 'bg-blue-100 text-blue-700 border-b-2 md:border-b-0 border-blue-500' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaUtensils className="mr-2" />
                Nutrición
              </button>
            </div>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="mb-8">
          {activeTab === 'salud' ? <ParametrosSalud /> : <FormularioComidas />}
        </div>


      </div>
    </div>
  );
};

export default Formularios;