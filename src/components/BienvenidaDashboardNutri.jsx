import React from 'react';

const BienvenidaDashboard = ({ rol }) => {
  const esNutri = rol === 'nutri';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-blue-600">Dashboard</h1>
        <p className="text-gray-600">
          {esNutri
            ? 'Monitoreo y seguimiento de pacientes'
            : 'Tu estado de salud y recomendaciones'}
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-2xl font-bold text-blue-600">0</h2>
          <p className="text-gray-600">Total Pacientes</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-2xl font-bold text-blue-600">0</h2>
          <p className="text-gray-600">Citas Hoy</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-2xl font-bold text-blue-600">0</h2>
          <p className="text-gray-600">Mensajes Nuevos</p>
        </div>
      </div>

      {/* Actividad reciente y próximas citas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Actividad reciente */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-bold text-blue-600 mb-4">
            Actividad Reciente de Pacientes
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Ana López</span>
              <span className="text-sm text-green-600">Completado</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Carlos Ruiz</span>
              <span className="text-sm text-blue-600">En progreso</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Laura Méndez</span>
              <span className="text-sm text-yellow-600">Atención</span>
            </li>
          </ul>
        </div>

        {/* Próximas citas */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-bold text-blue-600 mb-4">
            Próximas Citas
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Ana López</span>
              <span className="text-sm text-gray-500">10:30 AM</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Pedro Silva</span>
              <span className="text-sm text-gray-500">2:00 PM</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Carmen Díaz</span>
              <span className="text-sm text-gray-500">4:30 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-6">
      <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-bold text-blue-600 mb-4">
            Pacientes Mas Vulnerables
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Ana López</span>
              <span className="text-sm text-gray-500">Peso muy bajo</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Pedro Silva</span>
              <span className="text-sm text-gray-500">Diabetes</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Carmen Díaz</span>
              <span className="text-sm text-gray-500">Le dio sida</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default BienvenidaDashboard;