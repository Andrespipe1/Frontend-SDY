const BienvenidaDashboard = ({ rol }) => {
    const esNutri = rol === 'nutri'
  
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">EN CONSTRUCCION</h1>
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          ¡Bienvenido a Saludify!
        </h1>
        <p className="text-gray-700 text-lg mb-6 max-w-md">
          {esNutri
            ? 'Desde aquí podrás gestionar tus pacientes, enviar recomendaciones personalizadas y mantener conversaciones efectivas.'
            : 'Aquí puedes registrar tu estado de salud, recibir recomendaciones personalizadas y comunicarte con tu nutricionista.'}
        </p>
        <img
          src="/img/saludify-welcome.svg"
          alt="Bienvenida Saludify"
          className="w-72 md:w-96 mb-6"
        />
        <p className="text-sm text-gray-500">
          {esNutri ? 'Panel del nutricionista 🩺' : 'Panel del paciente 🧍‍♂️'}
        </p>
      </div>
    )
  }
  
  export default BienvenidaDashboard
  

  // import React, { Component } from 'react';
  // import { motion } from 'framer-motion';
  // import { FiActivity, FiUsers, FiTrendingUp, FiAward, FiBarChart2, FiCalendar } from 'react-icons/fi';
  
  // class SuperDashboard extends Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       darkMode: false,
  //       stats: {
  //         pacientes: { total: 127, cambio: 12 },
  //         consultas: { mes: 84, semana: 23 },
  //         satisfaccion: 4.9,
  //         progreso: 78,
  //         metricas: [
  //           { mes: 'Ene', pacientes: 45, consultas: 120, color: 'from-purple-500 to-pink-500' },
  //           { mes: 'Feb', pacientes: 68, consultas: 145, color: 'from-blue-500 to-teal-500' },
  //           { mes: 'Mar', pacientes: 92, consultas: 178, color: 'from-amber-500 to-red-500' },
  //           { mes: 'Abr', pacientes: 112, consultas: 210, color: 'from-emerald-500 to-green-500' },
  //           { mes: 'May', pacientes: 127, consultas: 234, color: 'from-indigo-500 to-purple-500' }
  //         ],
  //         topPacientes: [
  //           { nombre: 'Ana López', progreso: 92, foto: '/img/users/ana.jpg' },
  //           { nombre: 'Carlos M.', progreso: 88, foto: '/img/users/carlos.jpg' },
  //           { nombre: 'María G.', progreso: 85, foto: '/img/users/maria.jpg' }
  //         ]
  //       }
  //     };
  //   }
  
  //   toggleDarkMode = () => {
  //     this.setState(prev => ({ darkMode: !prev.darkMode }));
  //   };
  
  //   render() {
  //     const { rol } = this.props;
  //     const { darkMode, stats } = this.state;
  //     const esNutri = rol === 'nutri';
  
  //     const themeClasses = darkMode 
  //       ? 'bg-gray-900 text-gray-100' 
  //       : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800';
  
  //     return (
  //       <div className={`min-h-screen ${themeClasses} transition-colors duration-500`}>
  //         {/* Header futurista */}
  //         <header className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-b-3xl`}>
  //           <div className="flex justify-between items-center max-w-7xl mx-auto">
  //             <motion.div 
  //               initial={{ scale: 0.8 }}
  //               animate={{ scale: 1 }}
  //               transition={{ type: 'spring', stiffness: 300 }}
  //               className="flex items-center"
  //             >
  //               <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} flex items-center justify-center mr-4`}>
  //                 <FiActivity className="text-white text-2xl" />
  //               </div>
  //               <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
  //                 {esNutri ? 'SALUDIFY PRO DASHBOARD' : 'MI SALUD PREMIUM'}
  //               </h1>
  //             </motion.div>
              
  //             <button 
  //               onClick={this.toggleDarkMode}
  //               className={`p-2 rounded-full ${darkMode ? 'bg-indigo-900 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
  //             >
  //               {darkMode ? '☀️' : '🌙'}
  //             </button>
  //           </div>
  //         </header>
  
  //         <main className="max-w-7xl mx-auto px-6 py-8">
  //           {/* Sección de métricas principales */}
  //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
  //             <MetricCard 
  //               icon={<FiUsers className="text-3xl" />}
  //               title={esNutri ? "Pacientes Totales" : "Días Consecutivos"}
  //               value={stats.pacientes.total}
  //               change={stats.pacientes.cambio}
  //               darkMode={darkMode}
  //               gradient="from-indigo-500 to-blue-500"
  //             />
              
  //             <MetricCard 
  //               icon={<FiCalendar className="text-3xl" />}
  //               title={esNutri ? "Consultas/Mes" : "Sesiones/Semana"}
  //               value={esNutri ? stats.consultas.mes : stats.consultas.semana}
  //               change={5}
  //               darkMode={darkMode}
  //               gradient="from-emerald-500 to-teal-500"
  //             />
              
  //             <MetricCard 
  //               icon={<FiAward className="text-3xl" />}
  //               title="Satisfacción"
  //               value={stats.satisfaccion}
  //               isDecimal={true}
  //               darkMode={darkMode}
  //               gradient="from-amber-500 to-orange-500"
  //             />
              
  //             <MetricCard 
  //               icon={<FiTrendingUp className="text-3xl" />}
  //               title={esNutri ? "Retención" : "Progreso"}
  //               value={stats.progreso}
  //               unit="%"
  //               darkMode={darkMode}
  //               gradient="from-purple-500 to-pink-500"
  //             />
  //           </div>
  
  //           {/* Sección de gráficos 3D */}
  //           <motion.div 
  //             initial={{ opacity: 0, y: 20 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             transition={{ delay: 0.2 }}
  //             className={`mb-12 p-6 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
  //           >
  //             <div className="flex justify-between items-center mb-8">
  //               <h2 className="text-2xl font-bold">
  //                 {esNutri ? "Crecimiento Anual" : "Mi Evolución"}
  //               </h2>
  //               <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
  //                 Últimos 5 meses
  //               </div>
  //             </div>
              
  //             <div className="h-96 flex items-center justify-center relative">
  //               {/* Aquí iría un gráfico 3D espectacular con Three.js o similar */}
  //               <div className={`absolute inset-0 flex items-center justify-center rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
  //                 <div className="text-center">
  //                   <div className="text-5xl mb-4">📊</div>
  //                   <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
  //                     Gráfico 3D interactivo con crecimiento exponencial
  //                   </p>
  //                 </div>
  //               </div>
                
  //               {/* Mini gráficos de métricas */}
  //               <div className="absolute bottom-0 left-0 right-0 h-16 flex justify-around">
  //                 {stats.metricas.map((item, index) => (
  //                   <motion.div
  //                     key={index}
  //                     whileHover={{ scale: 1.1 }}
  //                     className={`w-1/5 mx-1 bg-gradient-to-b ${item.color} rounded-t-lg`}
  //                     style={{ height: `${item.pacientes / 1.5}%` }}
  //                   />
  //                 ))}
  //               </div>
  //             </div>
  //           </motion.div>
  
  //           {/* Sección inferior con más datos */}
  //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  //             {/* Top pacientes */}
  //             <div className={`col-span-2 p-6 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
  //               <h3 className="text-xl font-bold mb-6">{esNutri ? "Top Pacientes" : "Mis Logros"}</h3>
  //               <div className="space-y-4">
  //                 {stats.topPacientes.map((paciente, index) => (
  //                   <motion.div
  //                     key={index}
  //                     whileHover={{ scale: 1.02 }}
  //                     className={`flex items-center p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
  //                   >
  //                     <div className="relative w-12 h-12 mr-4">
  //                       <img 
  //                         src={paciente.foto} 
  //                         alt={paciente.nombre} 
  //                         className="w-full h-full rounded-full object-cover"
  //                       />
  //                       <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
  //                         #{index + 1}
  //                       </div>
  //                     </div>
  //                     <div className="flex-1">
  //                       <h4 className="font-semibold">{paciente.nombre}</h4>
  //                       <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
  //                         <div 
  //                           className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
  //                           style={{ width: `${paciente.progreso}%` }}
  //                         />
  //                       </div>
  //                     </div>
  //                     <div className="text-lg font-bold ml-4">
  //                       {paciente.progreso}%
  //                     </div>
  //                   </motion.div>
  //                 ))}
  //               </div>
  //             </div>
  
  //             {/* Quick Actions */}
  //             <div className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
  //               <h3 className="text-xl font-bold mb-6">Acciones Rápidas</h3>
  //               <div className="grid grid-cols-2 gap-4">
  //                 <ActionButton 
  //                   icon="📝" 
  //                   label={esNutri ? "Nuevo Plan" : "Nuevo Registro"} 
  //                   darkMode={darkMode}
  //                 />
  //                 <ActionButton 
  //                   icon="📊" 
  //                   label="Reportes" 
  //                   darkMode={darkMode}
  //                 />
  //                 <ActionButton 
  //                   icon="🔔" 
  //                   label="Notificaciones" 
  //                   darkMode={darkMode}
  //                   badge={3}
  //                 />
  //                 <ActionButton 
  //                   icon="⚙️" 
  //                   label="Configuración" 
  //                   darkMode={darkMode}
  //                 />
  //                 <ActionButton 
  //                   icon="💬" 
  //                   label="Mensajes" 
  //                   darkMode={darkMode}
  //                   badge={12}
  //                   colSpan={2}
  //                 />
  //               </div>
  
  //               {/* Mini calendario */}
  //               <div className={`mt-8 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
  //                 <div className="flex justify-between items-center mb-3">
  //                   <h4 className="font-semibold">Mayo 2023</h4>
  //                   <FiBarChart2 />
  //                 </div>
  //                 <div className="grid grid-cols-7 gap-1 text-center">
  //                   {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
  //                     <div key={i} className="text-xs font-bold">{day}</div>
  //                   ))}
  //                   {Array.from({ length: 31 }).map((_, i) => (
  //                     <div 
  //                       key={i} 
  //                       className={`p-1 rounded-full text-xs ${i === 14 ? 'bg-indigo-500 text-white' : ''}`}
  //                     >
  //                       {i + 1}
  //                     </div>
  //                   ))}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </main>
  
  //         {/* Efecto de partículas en el fondo */}
  //         <div className="fixed inset-0 -z-10 overflow-hidden">
  //           {Array.from({ length: 30 }).map((_, i) => (
  //             <motion.div
  //               key={i}
  //               className={`absolute rounded-full ${darkMode ? 'bg-indigo-900' : 'bg-blue-100'}`}
  //               style={{
  //                 width: Math.random() * 10 + 5,
  //                 height: Math.random() * 10 + 5,
  //                 left: `${Math.random() * 100}%`,
  //                 top: `${Math.random() * 100}%`,
  //               }}
  //               animate={{
  //                 y: [0, (Math.random() - 0.5) * 100],
  //                 x: [0, (Math.random() - 0.5) * 50],
  //                 opacity: [0.2, 0.8, 0.2],
  //               }}
  //               transition={{
  //                 duration: Math.random() * 10 + 10,
  //                 repeat: Infinity,
  //                 repeatType: 'reverse',
  //               }}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     );
  //   }
  // }
  
  // // Componente de tarjeta de métrica
  // const MetricCard = ({ icon, title, value, change, isDecimal, unit, darkMode, gradient }) => {
  //   return (
  //     <motion.div
  //       whileHover={{ y: -5 }}
  //       className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
  //     >
  //       <div className="flex justify-between">
  //         <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient}`}>
  //           {icon}
  //         </div>
  //         {change && (
  //           <div className={`px-2 py-1 rounded-full text-xs flex items-center ${change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
  //             {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
  //           </div>
  //         )}
  //       </div>
  //       <h3 className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
  //       <p className="text-3xl font-bold mt-2">
  //         {isDecimal ? value.toFixed(1) : value}
  //         {unit && <span className="text-xl ml-1">{unit}</span>}
  //       </p>
  //     </motion.div>
  //   );
  // };
  
  // // Componente de botón de acción
  // const ActionButton = ({ icon, label, darkMode, badge, colSpan }) => {
  //   return (
  //     <motion.button
  //       whileTap={{ scale: 0.95 }}
  //       className={`p-4 rounded-xl flex flex-col items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors relative ${colSpan === 2 ? 'col-span-2' : ''}`}
  //     >
  //       <span className="text-2xl mb-2">{icon}</span>
  //       <span className="text-sm">{label}</span>
  //       {badge && (
  //         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
  //           {badge}
  //         </span>
  //       )}
  //     </motion.button>
  //   );
  // };
  
  // export default SuperDashboard;