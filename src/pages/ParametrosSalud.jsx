import React, { useState } from 'react';

const ParametrosSalud = () => {
  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    nasCampos: ''
  });

  const calcularIMC = () => {
    if (formData.peso && formData.altura) {
      const alturaEnMetros = formData.altura / 100;
      const imc = (formData.peso / (alturaEnMetros * alturaEnMetros)).toFixed(1);
      
      // Determinar clasificación según OMS
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calcular posición del indicador en la barra de progreso
  const calcularPosicionIndicador = () => {
    if (!imcData.valor) return 0;
    const imcValue = parseFloat(imcData.valor);
    // Rango de IMC que queremos mostrar (15 a 40)
    return Math.min(Math.max((imcValue - 15) / (40 - 15) * 100, 0), 100);
  };

  return (
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
                value={formData.peso}
                onChange={handleChange}
                placeholder="70.5"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">kg</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
            <div className="relative">
              <input
                type="number"
                name="altura"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.altura}
                onChange={handleChange}
                placeholder="175"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">cm</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NAS Campos</label>
            <input
              type="text"
              name="nasCampos"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.nasCampos}
              onChange={handleChange}
              placeholder="Valor NAS"
            />
          </div>
        </div>
      </div>

      {/* Sección central - Visualización */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-4">
          <div className="text-5xl">👤</div>
          {imcData.valor && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              {formData.peso}kg / {formData.altura}cm
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Perfil corporal</p>
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
    </div>
  );
};

export default ParametrosSalud;