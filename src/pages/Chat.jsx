// components/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthProvider';

const Chat = ({ contacto, onBack }) => {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [socket, setSocket] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  useEffect(() => {
    const newSocket = io("https://backend-sdfy.onrender.com/", {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header fijo - Altura exacta igual a tu header principal */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center h-16 flex-shrink-0">
        {onBack && (
          <button onClick={onBack} className="mr-2 p-1 rounded-full hover:bg-gray-100 md:hidden">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
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
              {contacto.apellido?.charAt(0)?.toUpperCase() || ''}
            </div>
          )}
          <div>
            <h2 className="font-semibold text-gray-900">{contacto.nombre} {contacto.apellido}</h2>
            <p className="text-xs text-gray-500">{contacto.rol}</p>
          </div>
        </div>
      </div>

      {/* Área de mensajes con margen superior igual al header */}
      <div 
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{
          marginTop: '64px', // Igual a la altura de tu header principal
          height: 'calc(100vh - 64px - 64px - 72px)' // 100vh - header - chat header - footer
        }}
      >
      <div className="space-y-3">
        {mensajes.map((mensaje, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              mensaje.esMio ? "items-end" : "items-start"
            }`}
          >
            {/* Mostrar el nombre del remitente solo si no es tu mensaje */}
            {!mensaje.esMio && (
              <p className="text-xs text-gray-500 mb-1">{contacto.nombre || "Desconocido"}</p>
            )}
            <div
              className={`p-3 rounded-lg max-w-xs md:max-w-md ${
                mensaje.esMio
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {mensaje.contenido}
            </div>
            {/* Mostrar la hora del mensaje */}
            <p className="text-xs text-gray-400 mt-1">
              {new Date(mensaje.createdAt || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      </div>

      {/* Input fijo en la parte inferior */}
      <div className="bg-white border-t border-gray-200 p-4 h-20 flex-shrink-0">
        <form onSubmit={handleSubmit(enviarMensaje)} className="flex items-center h-full gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("mensaje", { required: true })}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 focus:outline-none"
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