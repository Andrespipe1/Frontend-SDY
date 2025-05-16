import { Link } from 'react-router-dom';
import { useState } from "react";
import Mensaje from '../components/Alerts/Mensaje';
import axios from 'axios';
import logo from '../assets/Logo.jpg';
const Register = () => {

    const [mensaje, setMensaje] = useState({});
    const [form, setform] = useState({
        nombre: "",
        apellido: "",
        edad: "",
        direccion: "",
        celular: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/registro`;
            const respuesta = await axios.post(url, form);
            setMensaje({ respuesta: respuesta.data.msg, tipo: true });
            setform({});
        } catch (error) {
            setMensaje({ respuesta: error.response.data.msg, tipo: false });
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                <img
                    className="mx-auto h-25 w-auto border-2 border-green-600 rounded-full"
                    src={logo}
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Crea tu cuenta
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-900">
                                Nombre
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    value={form.nombre || ""}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="apellido" className="block text-sm font-medium text-gray-900">
                                Apellido
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="apellido"
                                    id="apellido"
                                    value={form.apellido || ""}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="edad" className="block text-sm font-medium text-gray-900">
                            Edad
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="edad"
                                id="edad"
                                value={form.edad || ""}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-900">
                            Dirección
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="direccion"
                                id="direccion"
                                value={form.direccion || ""}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="celular" className="block text-sm font-medium text-gray-900">
                            Celular
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="celular"
                                id="celular"
                                value={form.celular || ""}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={form.email || ""}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Contraseña
                        </label>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={form.password || ""}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-gradient-to-r from-green-400 to-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Registrarse
                        </button>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login" className="font-semibold text-green-600 hover:text-green-500 cursor-pointer">
                            Inicia sesión
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
