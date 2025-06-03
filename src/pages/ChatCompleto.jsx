// components/ChatCompleto.jsx
import { useState } from 'react';
import ListaContactos from './ListaContactos';
import Chat from './Chat';

const ChatCompleto = () => {
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 border-r border-gray-300">
        <ListaContactos onSelectContacto={setContactoSeleccionado} />
      </div>
      <div className="w-2/3">
        {contactoSeleccionado ? (
          <Chat contacto={contactoSeleccionado} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600">
                Selecciona un contacto para chatear
              </h3>
              <p className="text-gray-500 mt-2">
                Elige de tu lista de contactos para comenzar una conversación
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatCompleto;