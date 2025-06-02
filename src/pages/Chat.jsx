import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthProvider';

const Chat = () => {
  const { user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [socket, setSocket] = useState(null);
  const [nameUser, setNameUser] = useState("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      setNameUser(user.nombre || user.email);
    }
  }, [user]);

  const handleMessageChat = (data) => {
    if (!socket) return console.error("No hay conexión con el servidor");

    const newMessage = {
      body: data.message,
      from: nameUser,
    };
    socket.emit("enviar-mensaje-front-back", newMessage);
    setResponses((prev) => [...prev, newMessage]);
    reset({ message: "" });
  };

  useEffect(() => {
    const newSocket = io("https://backend-sdy.onrender.com");
    setSocket(newSocket);
    newSocket.on("enviar-mensaje-front-back", (payload) => {
      setResponses((prev) => [...prev, payload]);
    });
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] pb-20"> {/* Añadido pb-20 para el footer */}
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: '80px' }}> {/* Espacio para el input */}
        <div className="space-y-3">
          {responses.map((response, index) => (
            <div
              key={index}
              className={`flex ${response.from === nameUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                  response.from === nameUser
                    ? 'bg-blue-800 text-white'
                    : 'bg-white text-gray-800 border border-gray-300'
                }`}
              >
                {response.from !== nameUser && (
                  <p className="text-xs font-semibold text-green-600 mb-1">{response.from}</p>
                )}
                <p className="text-sm break-words">{response.body}</p>
                <p className="text-right text-xs text-gray-400 mt-1">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input de mensaje (ahora sticky en lugar de fixed) */}
      <div className="bg-white p-4 border-t border-gray-300 sticky bottom-20 left-0 right-0 z-10"> {/* bottom-20 para el footer */}
        <form onSubmit={handleSubmit(handleMessageChat)} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            {...register("message", { required: "El mensaje no puede estar vacío" })}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-400 to-blue-600 hover:from-green-500 hover:to-blue-700 text-white rounded-full p-2 focus:outline-none transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
      </div>
    </div>
  );
};

export default Chat;