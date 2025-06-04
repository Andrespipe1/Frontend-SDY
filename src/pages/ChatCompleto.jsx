// components/ChatCompleto.jsx
import { useState } from 'react';
import ListaContactos from './ListaContactos';
import Chat from './Chat';

// components/ChatCompleto.jsx
const ChatCompleto = () => {
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);

  return (
    <div className="flex h-full" style={{ height: 'calc(100vh - 100px - 80px)' }}> {/* Resta header y footer */}
      {/* Lista de contactos */}
      <div className={`${contactoSeleccionado ? 'hidden md:block md:w-1/3' : 'w-full md:w-1/3'} bg-white border-r border-gray-200 overflow-y-auto`}>
        <ListaContactos onSelectContacto={setContactoSeleccionado} />
      </div>
      
      {/* Área de chat */}
      <div className={`${!contactoSeleccionado ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-gray-50`}>
        {contactoSeleccionado ? (
          <Chat contacto={contactoSeleccionado} onBack={() => setContactoSeleccionado(null)} />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full">
            <div className="text-center p-6 max-w-md">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un contacto</h3>
              <p className="text-sm text-gray-500">Elige un contacto para comenzar una conversación</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatCompleto;