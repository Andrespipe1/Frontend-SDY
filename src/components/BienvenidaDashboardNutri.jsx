import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import poster1 from '../public/assets/poster1.avif';
import poster2 from '../public/assets/poster2.jpg';
import poster3 from '../public/assets/poster3.jpg';
import EstadisticasPacientes from './EstaditicasPacientes';

const BienvenidaDashboardN = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    {
      url: poster1,
      title: 'Gestión Integral de Pacientes',
      description: 'Controla y monitoriza el progreso de todos tus pacientes en un solo lugar'
    },
    {
      url: poster2,
      title: 'Comunicación Efectiva',
      description: 'Chat en tiempo real para mantener contacto directo con tus pacientes'
    },
    {
      url: poster3,
      title: 'Herramientas Avanzadas',
      description: 'Accede a análisis detallados y recomendaciones basadas en datos'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Animaciones predefinidas
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const featureItem = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sección de Bienvenida (40% en desktop, 100% en mobile) */}
      <div className="w-full lg:w-2/5 xl:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 lg:p-8 flex flex-col">
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Titulo con animación */}
          <motion.div
            variants={fadeInUp}
            className="text-center mb-6 w-full"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              ¡Bienvenido a <motion.span 
                className="text-indigo-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >Saludify</motion.span>!
            </motion.h1>
            <motion.p 
              className="text-gray-700 mt-3 text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Tu plataforma profesional para la gestión nutricional
            </motion.p>
          </motion.div>

          {/* Carrusel con animaciones mejoradas */}
          <motion.div 
            className="w-full max-w-md mx-auto mb-6"
            variants={fadeInUp}
          >
            <div className="relative h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30,
                    duration: 0.5 
                  }}
                  className="absolute inset-0"
                >
                  <motion.img
                    src={images[currentImage].url}
                    alt={images[currentImage].title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-white font-semibold text-lg sm:text-xl">{images[currentImage].title}</h3>
                      <p className="text-white text-sm">{images[currentImage].description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Indicadores con animación */}
            <motion.div 
              className="flex justify-center mt-3 space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-2 rounded-full ${currentImage === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                  initial={{ width: 8 }}
                  animate={{ 
                    width: currentImage === index ? 24 : 8,
                    backgroundColor: currentImage === index ? '#2563eb' : '#d1d5db'
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Features con animaciones escalonadas */}
          <motion.div 
            className="grid grid-cols-2 gap-3 w-full max-w-md mt-4"
            variants={staggerContainer}
          >
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                text: 'Pacientes'
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                text: 'Chat profesional'
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                text: 'Análisis clínicos'
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                text: 'Reportes avanzados'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={featureItem}
                whileHover="hover"
                className="bg-white p-3 rounded-lg shadow-sm flex items-center"
              >
                <motion.div 
                  className="bg-blue-100 p-2 rounded-full mr-3"
                  whileHover={{ rotate: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <motion.span 
                  className="text-sm font-medium"
                  whileHover={{ color: '#2563eb' }}
                >
                  {feature.text}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Sección de Estadísticas (60% en desktop, 100% en mobile) */}
      <div className="w-full lg:w-3/5 xl:w-2/3 p-4 sm:p-6 overflow-y-auto max-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <EstadisticasPacientes />
        </div>
      </div>
    </div>
  );
};

export default BienvenidaDashboardN;