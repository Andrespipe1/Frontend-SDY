import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Mensaje from '../components/Alerts/Mensaje';
import { FaUser, FaLock, FaSave, FaKey, FaHome, FaPhone, FaBirthdayCake, FaEye, FaEyeSlash } from 'react-icons/fa';

const PerfilNutri = () => {
  const [mensaje, setMensaje] = useState({});
  const [perfil, setPerfil] = useState({ 
    nombre: '',
    apellido: '', 
    email: '', 
    _id: '',
    edad: '',
    direccion: '', 
    celular: '' 
  });

  const [passwordForm, setPasswordForm] = useState({
    passwordactual: '',
    passwordnuevo: ''
  });
  const [loading, setLoading] = useState(true);

  const mostrarMensaje = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    setTimeout(() => setMensaje({}), 3000);
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfilNutri`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPerfil(data);
      } catch (error) {
        mostrarMensaje({ respuesta: 'Error al obtener el perfil', tipo: false });
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, []);

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfil({ ...perfil, [name]: value });
    validateField(name, value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    validateField(name, value);
  };

  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/perfil-nutricionista/${perfil._id}`,
        perfil,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje({ respuesta: data.msg || 'Perfil actualizado correctamente', tipo: true });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al actualizar perfil',
        tipo: false
      });
    }
  };

  const handleActualizarPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/nutricionista/actualizar-password/${perfil._id}`,
        passwordForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje({ respuesta: data.msg, tipo: true });
      setPasswordForm({ passwordactual: '', passwordnuevo: '' });
    } catch (error) {
      mostrarMensaje({
        respuesta: error.response?.data?.msg || 'Error al actualizar contraseña',
        tipo: false
      });
      setPasswordForm({ passwordactual: '', passwordnuevo: '' });
    }
  };

  const [errors, setErrors] = useState({
    edad: '',
    celular: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false
  });

  // Validaciones en tiempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };
  
    switch (name) {
      case 'edad':
        newErrors.edad = value < 0 || value > 100 ? 'La edad debe estar entre 0 y 100 años' : '';
        break;
      case 'celular':
        newErrors.celular = !/^\d*$/.test(value) ? 'Solo se permiten números' : '';
        break;
      case 'passwordnuevo':
        const passwordErrors = [];
        if (value.length < 8) {
          passwordErrors.push("Mínimo 8 caracteres");
        }
        if (!/[A-Z]/.test(value)) {
          passwordErrors.push("Al menos una mayúscula");
        }
        if (!/[a-z]/.test(value)) {
          passwordErrors.push("Al menos una minúscula");
        }
        if (!/[0-9]/.test(value)) {
          passwordErrors.push("Al menos un número");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          passwordErrors.push("Al menos un carácter especial (!@#$%^&*.)");
        }
        newErrors.password = passwordErrors.length > 0 ? `La contraseña debe tener: ${passwordErrors.join(", ")}` : '';
        break;
      default:
        break;
    }
  
    setErrors(newErrors);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };
  return (
    loading ? (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Cargando tu perfil...</p>
        </div>
      </div>
    ) : (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Mensajes (se mantiene igual) */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
        {Object.keys(mensaje).length > 0 && (
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
        )}
      </div>

      {/* Contenedor principal */}
        {/* Tarjeta principal */}
        <div>
          {/* Sección superior con avatar */}
          <div className=" p-6 md:p-4 flex flex-col md:flex-row items-center">
            {/* Avatar */}
            <div className="relative group mb-3 md:mb-0 md:mr-8">
              <div className="w-38 h-38 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200 flex items-center justify-center">
 
                  <div className="flex-shrink-0 h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-4xl">
                    {perfil.nombre?.charAt(0)?.toUpperCase() || ''}
                    {perfil.apellido?.charAt(0)?.toUpperCase() || ''}
                  </div>
                
              </div>

            </div>

            {/* Información básica */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {perfil.nombre} {perfil.apellido} 
              </h2>

              <p className="text-gray-600 mt-1">{perfil.email}</p>
              
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                  <FaUser className="mr-1" /> Nutricionista
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                  <FaPhone className="mr-1" /> {perfil.celular || 'Sin teléfono'}
                </div>
                <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                  <FaBirthdayCake className="mr-1" /> {perfil.edad || '0'} años
                </div>
              </div>

            </div>
            
          </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                      <div className="flex items-center mb-6">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                          <FaUser size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                      </div>
          
                      <form onSubmit={handleActualizarPerfil} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaUser size={14} />
                              </div>
                              <input
                                type="text"
                                name="nombre"
                                value={perfil.nombre}
                                onChange={handlePerfilChange}
                                className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400"
                                placeholder="Ej: Juan"
                                required
                              />
                            </div>
                          </div>
          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                              type="text"
                              name="apellido"
                              value={perfil.apellido}
                              onChange={handlePerfilChange}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400"
                              placeholder="Ej: Pérez"
                              required
                            />
                          </div>
                        </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Edad</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaBirthdayCake size={14} />
                    </div>
                    <input
                      type="number"
                      name="edad"
                      value={perfil.edad}
                      onChange={handlePerfilChange}
                      className={`pl-10 w-full rounded-lg border ${errors.edad ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:ring-green-500 placeholder-gray-400`}
                      placeholder="Ej: 30"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Celular</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaPhone size={14} />
                    </div>
                    <input
                      type="text"
                      name="celular"
                      value={perfil.celular}
                      onChange={handlePerfilChange}
                      className={`pl-10 w-full rounded-lg border ${errors.celular ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:ring-green-500 placeholder-gray-400`}
                      placeholder="Ej: 123456789"
                      pattern="[0-9]*"
                      required
                    />
                  </div>
                  {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
                </div>
              </div>

              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaHome size={14} />
                </div>
                <input
                  type="text"
                  name="direccion"
                  value={perfil.direccion}
                  onChange={handlePerfilChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Ej: Av. Principal 123"
                  required
                />
              </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={!!errors.edad || !!errors.celular}
                >
                  <FaSave className="mr-2" />
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>

          {/* Formulario de contraseña */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            {/* ... (encabezado igual) */}
            
            <form onSubmit={handleActualizarPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaKey size={14} />
                  </div>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="passwordactual"
                    value={passwordForm.passwordactual}
                    onChange={handlePasswordChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500 placeholder-gray-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPassword.current ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock size={14} />
                  </div>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="passwordnuevo"
                    value={passwordForm.passwordnuevo}
                    onChange={handlePasswordChange}
                    className={`pl-10 w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:ring-green-500 placeholder-gray-400`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPassword.new ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  disabled={!!errors.password}
                >
                  <FaKey className="mr-2" />
                  Cambiar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    )
  );
};

export default PerfilNutri; 