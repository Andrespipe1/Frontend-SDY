const BienvenidaDashboard = ({ rol }) => {
    const esNutri = rol === 'nutri'
  
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">EN CONSTRUCCION</h1>
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          ¡Bienvenido a Saludify!
        </h1>
        <p className="text-gray-700 text-lg mb-6 max-w-md">
          {esNutri
            ? 'Desde aquí podrás gestionar tus pacientes, enviar recomendaciones personalizadas y mantener conversaciones efectivas.'
            : 'Aquí puedes registrar tu estado de salud, recibir recomendaciones personalizadas y comunicarte con tu nutricionista.'}
        </p>
        <img
          src="/img/saludify-welcome.svg"
          alt="Bienvenida Saludify"
          className="w-72 md:w-96 mb-6"
        />
        <p className="text-sm text-gray-500">
          {esNutri ? 'Panel del nutricionista 🩺' : 'Panel del paciente 🧍‍♂️'}
        </p>
      </div>
    )
  }
  
  export default BienvenidaDashboard
  