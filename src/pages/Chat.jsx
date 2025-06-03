import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthProvider';

const Chat = ({ contacto }) => {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [socket, setSocket] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io("https://backend-sdy.onrender.com", {
      withCredentials: true
    });
    setSocket(newSocket);

    if (user?._id) {
      newSocket.emit('unirse-sala', user._id);
    }

    newSocket.on('mensaje-privado', (mensaje) => {
      setMensajes(prev => [...prev, {
        ...mensaje,
        esMio: false
      }]);
    });

    newSocket.on('mensaje-privado-confirmacion', (mensaje) => {
      setMensajes(prev => [...prev, {
        ...mensaje,
        esMio: true
      }]);
    });

    if (contacto?._id && user?._id) {
      newSocket.emit('cargar-historial', {
        usuarioId: user._id,
        contactoId: contacto._id
      });
    }

    newSocket.on('historial-cargado', (historial) => {
      setMensajes(historial.map(msg => ({
        ...msg,
        esMio: msg.emisor === user._id
      })));
    });

    return () => newSocket.disconnect();
  }, [user, contacto]);

  const enviarMensaje = (data) => {
    if (!socket || !contacto) {
      console.error("Socket no conectado o contacto no seleccionado");
      return;
    }

    try {
      socket.emit('mensaje-privado', {
        emisorId: user._id,
        receptorId: contacto._id,
        contenido: data.mensaje
      });

      reset({ mensaje: "" });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const nombreUsuario = user?.nombre || user?.email || "Usuario";

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Encabezado con estilo visual */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-3 shadow-md">
        <h1 className="text-lg font-bold">Chat en línea</h1>
        <p className="text-xs opacity-90">Conectado como: {nombreUsuario}</p>
      </div>

      {/* Mensajes - Altura calculada para evitar solapamiento con footer */}
      <div
          className="flex-1 p-4"
          style={{ height: 'calc(100vh - 140px)' }}
        >
          <div className="h-full flex flex-col justify-end overflow-y-auto pr-2">
            <div className="space-y-3">
            {mensajes.map((mensaje, index) => (
              <div
                key={index}
                className={`flex ${mensaje.esMio ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                    mensaje.esMio
                      ? 'bg-blue-800 text-white'
                      : 'bg-white text-gray-800 border border-gray-300'
                  }`}
                >
                  {!mensaje.esMio && (
                    <p className="text-xs font-semibold text-green-600 mb-1">
                      {contacto?.nombre || 'Usuario'}
                    </p>
                  )}
                  <p className="text-sm break-words">{mensaje.contenido}</p>
                  <p className="text-right text-xs text-gray-400 mt-1">
                    {new Date(mensaje.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input de mensaje */}
      <div className="bg-white p-4 border-t border-gray-300 sticky bottom-20 left-0 right-0 z-10">
        <form onSubmit={handleSubmit(enviarMensaje)} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            {...register("mensaje", { required: true })}
            disabled={!contacto}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-400 to-blue-600 hover:from-green-500 hover:to-blue-700 text-white rounded-full p-2 focus:outline-none transition-all"
            disabled={!contacto}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
