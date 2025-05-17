import React, { useState } from 'react';
import { FaUtensils, FaCoffee, FaHamburger, FaIceCream, FaPlus } from 'react-icons/fa';

const FormularioComidas = () => {
  const [comidas, setComidas] = useState({
    desayuno: '',
    almuerzo: '',
    cena: '',
    snacks: ''
  });

  const handleChange = (e) => {
    setComidas({
      ...comidas,
      [e.target.name]: e.target.value
    });
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
      name: 'snacks',
      label: 'Snacks',
      icon: <FaIceCream className="text-pink-500" />,
      placeholder: 'Ej: Frutos secos, yogur griego con frutas...'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Registro de Alimentación</h3>
        
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
                value={comidas[comida.name]}
                onChange={handleChange}
                placeholder={comida.placeholder}
              />
              <div className="flex justify-end mt-1">
                <button 
                  type="button"
                  className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaPlus className="mr-1" size={10} />
                  Añadir alimento
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Notas adicionales</h4>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="2"
            placeholder="Alergias, preferencias, observaciones..."
          />
        </div>
      </div>
    </div>
  );
};

export default FormularioComidas;