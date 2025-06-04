import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BienvenidaDashboard = ({ rol }) => {
  const esNutri = rol === 'nutri';
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    {
      url: '/src/public/assets/poster1.avif',
      title: esNutri ? 'Gestión de Pacientes' : 'Seguimiento Personalizado',
      description: esNutri 
        ? 'Controla el progreso de todos tus pacientes' 
        : 'Registra tu evolución diaria'
    },
    {
      url: '/src/public/assets/poster2.jpg',
      title: esNutri ? 'Comunicación Efectiva' : 'Conecta con tu Nutricionista',
      description: esNutri 
        ? 'Chat en tiempo real con tus pacientes' 
        : 'Consulta directamente con profesionales'
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
    <div className="relative h-screen overflow-hidden flex flex-col">
      {/* Contenido principal con animaciones */}
      <motion.div 
        className="flex-0.5 flex flex-col items-center justify-center px-6 py-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Titulo con animación */}
        <motion.div
          variants={fadeInUp}
          className="text-center mb-6"
        >
          <motion.h1 
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700"
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
            className="text-gray-700 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {esNutri
              ? 'Herramientas profesionales para nutricionistas'
              : 'Tu camino hacia una vida más saludable'}
          </motion.p>
        </motion.div>

        {/* Carrusel con animaciones mejoradas */}
        <motion.div 
          className="w-full max-w-3/6 mx-auto mb-6"
          variants={fadeInUp}
        >
          <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
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
                    <h3 className="text-white font-semibold">{images[currentImage].title}</h3>
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
              text: esNutri ? 'Pacientes' : 'Progreso'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              ),
              text: 'Chat'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              text: esNutri ? 'Análisis' : 'Recomendaciones'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              text: 'IA'
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
  );
};

export default BienvenidaDashboard;