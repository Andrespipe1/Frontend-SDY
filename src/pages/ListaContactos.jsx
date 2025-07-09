import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';

const ListaContactos = ({ onSelectContacto }) => {
  const { user } = useAuth();
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarContactos = async () => {
      try {
        let url = '';
        if (user.rol === 'paciente') {
          url = `${import.meta.env.VITE_BACKEND_URL}/listar-nutricionistas`;
        } else if (user.rol === 'nutricionista') {
          url = `${import.meta.env.VITE_BACKEND_URL}/listar-pacientes`;
        }

        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          // Asegúrate de que data sea un array
          const contactosArray = Array.isArray(data) ? data : data.pacientes || [];
          setContactos(contactosArray);

        } else {
          console.error('Error al cargar contactos:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      cargarContactos();
    }
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Cargando contactos...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Contactos</h2>
      <ul className="space-y-2">
        {contactos.map((contacto) => (
          <li
            key={contacto._id}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
            onClick={() => onSelectContacto(contacto)}
          >
            <div className="flex items-center space-x-3">
              {contacto.avatar ? (
                <img
                  src={contacto.avatar}
                  alt={contacto.nombre}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {contacto.nombre?.charAt(0)?.toUpperCase() || ''}

                </div>
              )}
              <div>
                <p className="font-medium">
                  {contacto.nombre} {contacto.apellido}
                </p>
                <p className="text-sm text-gray-500">{contacto.rol}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaContactos;