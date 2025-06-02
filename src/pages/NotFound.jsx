import { useNavigate } from 'react-router-dom';
import logo from '../assets/LogoF.png';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        // Si hay historial, regresa a la página anterior
        // Si no hay historial (o viene de otro sitio), redirige al landing
        if (window.history.length > 1) {
            navigate(-1); // Regresa a la página anterior
        } else {
            navigate('/landing');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                {/* Logo */}
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="mx-auto h-32 w-32 border-2 border-green-600 rounded-full"
                />
                
                {/* Título */}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Página no encontrada
                </h2>
                
                {/* Mensaje */}
                <p className="mt-4 text-lg text-gray-600">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                
                {/* Botón */}
                <div className="mt-8">
                    <button
                        onClick={handleGoBack}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;