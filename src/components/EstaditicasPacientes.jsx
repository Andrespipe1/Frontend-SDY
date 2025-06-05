import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const EstadisticasPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    bajoPeso: 0,
    pesoNormal: 0,
    sobrepeso: 0,
    obesidad: 0,
    ultimosRegistros: []
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener lista de pacientes
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/listar-pacientes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const pacientesData = Array.isArray(response.data)
          ? response.data
          : response.data.pacientes || [];

        setPacientes(pacientesData);

        // Obtener parámetros de cada paciente
        const pacientesConParametros = await Promise.all(
          pacientesData.map(async (paciente) => {
            try {
              const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${paciente._id}`,
                {
                  headers: { 'Authorization': `Bearer ${token}` }
                }
              );

              return { ...paciente, parametros: res.data };
            } catch (error) {

              return { ...paciente, parametros: [] };
            }
          })
        );



        calcularEstadisticas(pacientesConParametros);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calcularEstadisticas = (pacientes) => {
    let bajoPeso = 0;
    let pesoNormal = 0;
    let sobrepeso = 0;
    let obesidad = 0;
    const ultimosRegistros = [];
  
    pacientes.forEach((paciente) => {
      // Accedemos a los parámetros correctamente - están en paciente.parametros.parametros
      const parametrosPaciente = paciente.parametros?.parametros || [];
  
      if (parametrosPaciente.length > 0) {
        const ultimoParametro = parametrosPaciente[parametrosPaciente.length - 1];
        
        if (ultimoParametro.peso && ultimoParametro.estatura) {
          const estaturaMetros = ultimoParametro.estatura / 100;
          const imc = ultimoParametro.peso / (estaturaMetros * estaturaMetros);
  
          // Clasificación del IMC
          if (imc < 18.5) {
            bajoPeso++;
          } else if (imc < 25) {
            pesoNormal++;
          } else if (imc < 30) {
            sobrepeso++;
          } else {
            obesidad++;
          }
  
          // Agregar a últimos registros
          ultimosRegistros.push({
            nombre: `${paciente.nombre} ${paciente.apellido}`,
            imc: imc.toFixed(1),
            peso: ultimoParametro.peso,
            estatura: ultimoParametro.estatura,
            fecha: ultimoParametro.fecha ? new Date(ultimoParametro.fecha).toLocaleDateString() : 'Sin fecha',
            avatar: paciente.avatar
          });
        }
      }
    });
  
    setStats({
      total: pacientes.length,
      bajoPeso,
      pesoNormal,
      sobrepeso,
      obesidad,
      ultimosRegistros: ultimosRegistros
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5)
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas de Pacientes</h2>
      
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Pacientes</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium">Bajo Peso</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.bajoPeso}</p>
          <p className="text-sm text-gray-500">
            {stats.total > 0 ? ((stats.bajoPeso / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Peso Normal</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.pesoNormal}</p>
          <p className="text-sm text-gray-500">
            {stats.total > 0 ? ((stats.pesoNormal / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm font-medium">Sobrepeso/Obesidad</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.sobrepeso + stats.obesidad}</p>
          <p className="text-sm text-gray-500">
            {stats.total > 0 ? (((stats.sobrepeso + stats.obesidad) / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Gráficos y detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución de IMC */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución de IMC</h3>
          <div className="h-64">
            <CircularProgressbar
              value={stats.pesoNormal}
              maxValue={stats.total}
              text={`${stats.total > 0 ? ((stats.pesoNormal / stats.total) * 100).toFixed(0) : 0}% Normal`}
              styles={buildStyles({
                pathColor: `#10B981`,
                textColor: '#374151',
                trailColor: '#E5E7EB',
                textSize: '16px',
              })}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="h-3 w-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
              <span className="text-xs text-gray-600">Bajo peso</span>
              <p className="text-sm font-medium">{stats.bajoPeso}</p>
            </div>
            <div className="text-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <span className="text-xs text-gray-600">Normal</span>
              <p className="text-sm font-medium">{stats.pesoNormal}</p>
            </div>
            <div className="text-center">
              <div className="h-3 w-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
              <span className="text-xs text-gray-600">Alto</span>
              <p className="text-sm font-medium">{stats.sobrepeso + stats.obesidad}</p>
            </div>
          </div>
        </div>

        {/* Últimos registros */}
        <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Últimos Registros</h3>
          <div className="space-y-4">
            {stats.ultimosRegistros.length > 0 ? (
              stats.ultimosRegistros.map((registro, index) => (
                <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition px-4">
                  {registro.avatar ? (
                <img
                  src={registro.avatar}
                  alt={registro.nombre}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {registro.nombre?.charAt(0)?.toUpperCase() || ''}

                </div>
              )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{registro.nombre}</h4>
                    <p className="text-sm text-gray-500">Peso: {registro.peso} kg - IMC: {registro.imc}</p>
                  </div>
                  <span className="text-xs text-gray-400">{registro.fecha}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay registros recientes</p>
            )}
          </div>
        </div>
      </div>

      {/* Detalle por categoría */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalle por Categoría</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pacientes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rango IMC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Bajo peso
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.bajoPeso}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats.total > 0 ? ((stats.bajoPeso / stats.total) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">&lt; 18.5</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Normal
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.pesoNormal}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats.total > 0 ? ((stats.pesoNormal / stats.total) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18.5 - 24.9</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                    Sobrepeso
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.sobrepeso}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats.total > 0 ? ((stats.sobrepeso / stats.total) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25 - 29.9</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Obesidad
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.obesidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats.total > 0 ? ((stats.obesidad / stats.total) * 100).toFixed(1) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">≥ 30</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPacientes;