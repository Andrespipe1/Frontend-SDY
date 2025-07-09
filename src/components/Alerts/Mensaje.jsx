import { useEffect, useState } from 'react';

const Mensaje = ({ children, tipo, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Auto-cerrar después de 5 segundos
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
            <div className={`p-4 border-l-4 ${tipo ? 'border-green-500' : 'border-red-500'} rounded-lg shadow-lg
                ${tipo ? 'bg-green-50' : 'bg-red-50'} flex items-start space-x-3`}>
                <div className="flex-shrink-0">
                    <svg className={`w-5 h-5 ${tipo ? 'text-green-500' : 'text-red-500'}`}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`text-sm ${tipo ? 'text-green-800' : 'text-red-800'}`}>
                        <p>{children}</p>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <button
                        onClick={handleClose}
                        className={`inline-flex rounded-md p-1.5 ${tipo ? 'text-green-500 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${tipo ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Mensaje;