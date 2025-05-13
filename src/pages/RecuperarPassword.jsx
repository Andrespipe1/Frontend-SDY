import { Link } from "react-router";

const RecuperarPassword = () => {
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-[1000px] md:w-[600px] md:h-[400px] p-8 md:p-10 flex flex-col justify-center">
        <h1 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Recupera tu contraseña
        </h1>
        <small className="text-red-700 block my-4 text-sm text-center">
          No te preocupes, te enviaremos un correo para que puedas recuperar tu contraseña.
        </small>

        <form>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Ingresa tu email"
              className="block w-full rounded-md border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 py-2 px-3 text-gray-700"
              name="email"
            />
          </div>

          <button className="bg-gradient-to-r from-green-400 to-blue-600 text-white py-2 w-full rounded-lg mt-3 hover:bg-indigo-500 cursor-pointer transition duration-300">
            Enviar email
          </button>
        </form>

        <div className="mt-5 text-sm flex justify-between items-center">
          <p>¿Ya recordaste tu contraseña?</p>
          <Link
            to="/login"
            className="py-2 px-6 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarPassword;
