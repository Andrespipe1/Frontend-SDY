import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaSave, FaKey, FaHome, FaPhone, 
         FaBirthdayCake, FaEye, FaEyeSlash, FaCamera, FaSpinner } from 'react-icons/fa';
import Mensaje from '../components/Alerts/Mensaje';
import { MoonStar } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
const Perfil = () => {
  const { token } = useAuth();
  // Estados para el perfil y contraseña
  const [perfil, setPerfil] = useState({ 
    nombre: '',
    apellido: '', 
    email: '', 
    _id: '',
    edad: '',
    direccion: '', 
    celular: '',
    avatar: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    passwordactual: '',
    passwordnuevo: ''
  });

  // Estados para la gestión del avatar
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Estados para validaciones
  const [errors, setErrors] = useState({
    edad: '',
    celular: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false
  });

  const [mensaje, setMensaje] = useState({});
    // Función para mostrar mensajes
  const mostrarMensaje = (nuevoMensaje) => {
      setMensaje(nuevoMensaje);
      setTimeout(() => setMensaje({}), 3000); // Limpia el mensaje después de 3 segundos
  };

  // Obtener datos del perfil al cargar el componente
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerfil(data);
      } catch (error) {
        mostrarMensaje({ respuesta: 'Error al obtener el perfil', tipo: false });
      }
    };

    obtenerPerfil();
  }, []);

  // Manejar cambios en los campos del formulario
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

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      mostrarMensaje({ respuesta: 'Solo se permiten imágenes JPEG, PNG o GIF', tipo: false });
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      mostrarMensaje({ respuesta: 'La imagen no debe exceder los 5MB', tipo: false });
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Subir avatar al servidor
  const handleUploadAvatar = async () => {
    if (!selectedImage) {
      mostrarMensaje({ respuesta: 'Por favor selecciona una imagen', tipo: false });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('imagen', selectedImage);

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/avatar/${perfil._id}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      mostrarMensaje({ respuesta: data.msg || 'Avatar actualizado correctamente', tipo: true });
      setPerfil(prev => ({ ...prev, avatar: data.avatar }));
      setPreviewImage('');
      setSelectedImage(null);
    } catch (error) {
      mostrarMensaje({ respuesta: error.response?.data?.msg || 'Error al actualizar avatar', tipo: false });
    } finally {
      setIsUploading(false);
    }
  };

  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/${perfil._id}`,
        perfil,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje({ respuesta: data.msg || 'Perfil actualizado correctamente', tipo: true });
    } catch (error) {
      mostrarMensaje({ respuesta: error.response?.data?.msg || 'Error al actualizar perfil', tipo: false });
    }
  };

  // Actualizar contraseña
  const handleActualizarPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/paciente/actualizar-password/${perfil._id}`,
        passwordForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje({ respuesta: data.msg || 'Contraseña actualizada correctamente', tipo: true });
      setPasswordForm({ passwordactual: '', passwordnuevo: '' });
    } catch (error) {
      mostrarMensaje({ respuesta: error.response?.data?.msg || 'Error al actualizar contraseña', tipo: false });
    }
  };

  // Validaciones
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
        newErrors.password = value && value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '';
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-2 px-4 sm:px-6 lg:px-16">
      {/* Mensaje */}
      {Object.keys(mensaje).length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Mi Perfil</h1>
        <p className="mt-2 text-lg text-gray-600 text-center">Administra tu información personal y seguridad</p>

        {/* Sección de Avatar */}
        <div className="flex flex-col items-center mb-2 mt-4">
          <div className="relative group mb-4">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
              {perfil.avatar || previewImage ? (
                <img
                  src={previewImage || perfil.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = '/default-avatar.png')}
                />
              ) : (
                <div className="flex-shrink-0 h-full w-full rounded-full bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center text-white font-bold text-4xl">
                  {perfil.nombre?.charAt(0)?.toUpperCase() || ''}
                  {perfil.apellido?.charAt(0)?.toUpperCase() || ''}
                </div>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-md transform hover:scale-110"
              title="Cambiar foto de perfil"
            >
              <FaCamera className="text-lg" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {previewImage && (
            <div className="flex gap-4">
              <button
                onClick={handleUploadAvatar}
                disabled={isUploading}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white ${
                  isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors shadow-md`}
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <FaSave /> Guardar Avatar
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setPreviewImage('');
                  setSelectedImage(null);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-md"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de información personal */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaUser className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
            </div>
          
            <form onSubmit={handleActualizarPerfil} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser className="text-sm" />
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      value={perfil.nombre}
                      onChange={handlePerfilChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 transition-all"
                      placeholder="Ej: Juan"
                      required
                    />
                  </div>
                </div>
                
                {/* Apellido */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Apellido</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="apellido"
                      value={perfil.apellido}
                      onChange={handlePerfilChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 transition-all"
                      placeholder="Ej: Pérez"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Edad */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Edad</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaBirthdayCake className="text-sm" />
                    </div>
                    <input
                      type="number"
                      name="edad"
                      value={perfil.edad}
                      onChange={handlePerfilChange}
                      className={`pl-10 w-full rounded-lg border ${
                        errors.edad ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 transition-all`}
                      placeholder="Ej: 30"
                      min="0"
                      max="100"
                      required
                    />
                    {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
                  </div>
                </div>

                {/* Celular */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Celular</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaPhone className="text-sm" />
                    </div>
                    <input
                      type="text"
                      name="celular"
                      value={perfil.celular}
                      onChange={handlePerfilChange}
                      className={`pl-10 w-full rounded-lg border ${
                        errors.celular ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 transition-all`}
                      placeholder="Ej: 123456789"
                      pattern="[0-9]*"
                      required
                    />
                    {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaHome className="text-sm" />
                  </div>
                  <input
                    type="text"
                    name="direccion"
                    value={perfil.direccion}
                    onChange={handlePerfilChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 transition-all"
                    placeholder="Ej: Av. Principal 123"
                    required
                  />
                </div>
              </div>

              {/* Botón de guardar */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                  disabled={!!errors.edad || !!errors.celular}
                >
                  <FaSave /> Guardar cambios
                </button>
              </div>
            </form>
          </div>

          {/* Formulario de seguridad */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaLock className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Seguridad</h2>
            </div>
            
            <form onSubmit={handleActualizarPassword} className="space-y-6">
              {/* Contraseña actual */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaKey className="text-sm" />
                  </div>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="passwordactual"
                    value={passwordForm.passwordactual}
                    onChange={handlePasswordChange}
                    className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500 placeholder-gray-400 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Nueva contraseña */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="passwordnuevo"
                    value={passwordForm.passwordnuevo}
                    onChange={handlePasswordChange}
                    className={`pl-10 w-full rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 focus:border-green-500 focus:ring-green-500 placeholder-gray-400 transition-all`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Botón de cambiar contraseña */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                  disabled={!!errors.password}
                >
                  <FaKey /> Cambiar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

  );

};

export default Perfil;

