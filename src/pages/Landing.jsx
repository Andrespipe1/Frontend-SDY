import { Link } from 'react-router-dom';
import logo from '../assets/Logo.jpg';
const LandingPage = () => {
    return (
        <div>
            <main className='bg-[#F5F5F5] px-4 md:px-10 lg:px-20 xl:px-40'>
                <section className='px-4 md:px-10 lg:px-20 xl:px-40'>
                    <nav className='p-6 flex justify-between items-center'>
                        <h1 className='text-3xl font-semibold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent'>
                            SALUDIFI
                        </h1>
                    </nav>

                    <div className='text-center pt-16'>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent mb-6 md:text-6xl">
                            TRANSFORMA TU SALUD CON TECNOLOGÍA
                        </h2>

                        <h3 className='text-2xl text-gray-800 mb-6 md:text-3xl font-medium'>
                            Tu Compañero de Salud Personalizado
                        </h3>
                        <p className='text-lg text-gray-800 max-w-2xl mx-auto mb-6 leading-relaxed md:text-xl'>
                            "Todo lo que necesitas para cuidar de ti, con la comodidad de un solo clic."
                            <br />
                            Ya sea que quieras mejorar tu dieta, tus rutinas de ejercicio o dormir mejor, nuestra aplicación te ofrece herramientas fáciles de usar y recomendaciones basadas en tus datos.
                        </p>

                        <Link 
                            to="/login" 
                            className='bg-gradient-to-r from-green-400 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-green-500 hover:shadow-lg mt-6 inline-block'>
                            ¡Empieza ahora!
                        </Link>
                    </div>

                    <div className='relative mx-auto mt-12 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-b from-green-400 to-green-600 rounded-full overflow-hidden shadow-lg dark:from-orange-300 dark:to-orange-500'>
                        <img 
                            src={logo} 
                            alt="logo-salud" 
                            className='w-full h-full object-cover transition-all duration-500 transform hover:scale-102'
                        />
                    </div>
                </section>

                <section className="mt-16">
                    <div>
                        <h3 className='text-3xl py-1 text-gray-800'>Servicios Ofrecidos</h3>
                        <p className='text-md py-2 leading-8 text-gray-800'>
                            Ofrecemos una variedad de servicios para ayudarte a mejorar tu salud y bienestar.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                        <ServiceCard 
                            title="Chat en tiempo real"
                            description="Conéctate con nutricionistas para recibir asesoramiento en tiempo real." 
                        />
                        <ServiceCard 
                            title="Seguimiento de Datos" 
                            description="Monitorea tu progreso en dieta, ejercicio y sueño con nuestras herramientas de seguimiento."
                        />
                        <ServiceCard 
                            title="Planificación de Comidas" 
                            description="Planifica tus comidas de acuerdo a tus preferencias y necesidades nutricionales."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};
export default LandingPage;

const ServiceCard = ({ title, description }) => {
    return (
        <div className='text-center shadow-2xl p-10 rounded-xl my-10 bg-white'>
            <div className='mx-auto mb-4 w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600'>
                {title.charAt(0)}
            </div>
            <h3 className='text-lg font-medium pb-2 text-indigo-600'>{title}</h3>
            <p className='text-gray-800'>{description}</p>
        </div>
    );
};
