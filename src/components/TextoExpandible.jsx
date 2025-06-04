// Primero, crea un componente auxiliar para manejar el texto expandible
import React, { useState } from 'react';
const TextoExpandible = ({ texto, maxCaracteres = 200 }) => {
    const [expandido, setExpandido] = useState(false);
    
    if (!texto) return null;
  
    const debeTruncar = texto.length > maxCaracteres;
    const textoMostrado = expandido ? texto : (debeTruncar ? `${texto.substring(0, maxCaracteres)}...` : texto);
  
    return (
      <div>
        <p className="text-gray-700 whitespace-pre-line">{textoMostrado}</p>
        {debeTruncar && (
            <button
                onClick={() => setExpandido(!expandido)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-2 focus:outline-none flex items-center"
                >
                {expandido ? (
                    <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Leer menos
                    </>
                ) : (
                    <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Leer más
                    </>
                )}
                </button>
        )}
      </div>
    );
  };
  export default TextoExpandible;