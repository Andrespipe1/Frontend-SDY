import { Link } from 'react-router-dom';
import { useState } from "react";
import Mensaje from '../components/Alerts/Mensaje';
import axios from 'axios';
import logo from '../assets/LogoF.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [mensaje, setMensaje] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [form, setform] = useState({
        nombre: "",
        apellido: "",
        edad: "",
        direccion: "",
        celular: "",
        email: "",
        password: ""
    });
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validaciones específicas por campo
        if (name === 'nombre' || name === 'apellido') {
            // Solo letras y espacios, máximo 20 caracteres
            if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{0,20}$/.test(value)) {
                setform({
                    ...form,
                    [name]: value
                });
            }
        } else if (name === 'edad') {
            // Solo números y borrado
            if (value === '' || /^\d+$/.test(value)) {
                setform({
                    ...form,
                    [name]: value
                });
            }
        } else if (name === 'celular') {
            // Solo números
            if (/^\d*$/.test(value)) {
                setform({
                    ...form,
                    [name]: value
                });
            }
        } else if (name === 'password') {
            setform({
                ...form,
                [name]: value
            });
            
            // Validaciones de contraseña en tiempo real
            setPasswordErrors({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /\d/.test(value),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            });
        } else {
            setform({
                ...form,
                [name]: value
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validatePassword = (password) => {
        const errors = [];
        
        if (password.length < 8) {
            errors.push("mínimo 8 caracteres");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("al menos una mayúscula");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("al menos una minuscula");
        }
        if (!/\d/.test(password)) {
            errors.push("al menos un número");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("al menos un caracter especial");
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones adicionales antes de enviar
        const errors = [];
        
        if (form.nombre.length < 2) {
            errors.push("El nombre debe tener al menos 2 caracteres");
        }
        
        if (form.apellido.length < 2) {
            errors.push("El apellido debe tener al menos 2 caracteres");
        }
        
        if (!form.edad || form.edad < 1 || form.edad > 120) {
            errors.push("La edad debe ser entre 1 y 100 años");
        }
        
        if (!form.celular || form.celular.length < 7) {
            errors.push("El celular debe tener al menos 10 dígitos");
        }
        
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            errors.push("Ingrese un email válido");
        }
        
        const passwordValidationErrors = validatePassword(form.password);
        if (passwordValidationErrors.length > 0) {
            errors.push(`La contraseña debe tener: ${passwordValidationErrors.join(", ")}`);
        }

        if (errors.length > 0) {
            setMensaje({ respuesta: errors.join(". "), tipo: false });
            return;
        }

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/registro`;
            const respuesta = await axios.post(url, form);
            setMensaje({ respuesta: respuesta.data.msg, tipo: true });
            setform({});
        } catch (error) {
            setMensaje({ respuesta: error.response?.data?.msg || "Error al registrar", tipo: false });
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {Object.keys(mensaje).length > 0 && (
                    <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                )}
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
                                    placeholder='Juan'
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    value={form.nombre || ""}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    maxLength={20}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
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
                                    placeholder='Ramirez'
                                    type="text"
                                    name="apellido"
                                    id="apellido"
                                    value={form.apellido || ""}
                                    onChange={handleChange}
                                    required
                                    maxLength={20}
                                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
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
                                type="text"
                                name="edad"
                                id="edad"
                                value={form.edad || ""}
                                onChange={handleChange}
                                required
                                min="1"
                                max="100"
                                placeholder='1-100'
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
                                maxLength={50}
                                pattern="[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+"
                                placeholder="Calle, número, ciudad"
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
                                pattern="\d*"
                                minLength="10"
                                maxLength="10"
                                placeholder='0123456789'
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
                                placeholder='user@example.com'
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                            Contraseña
                        </label>
                        <div className="mt-2 relative">
                            <input
                                placeholder='**********'
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                value={form.password || ""}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                            <p>La contraseña debe contener:</p>
                            <ul className="list-disc pl-5">
                                <li className={passwordErrors.length ? "text-green-500" : "text-red-500"}>
                                    Mínimo 8 caracteres
                                </li>
                                <li className={passwordErrors.uppercase ? "text-green-500" : "text-red-500"}>
                                    Al menos una mayúscula
                                </li>
                                <li className={passwordErrors.lowercase ? "text-green-500" : "text-red-500"}>
                                    Al menos una minuscula
                                </li>
                                <li className={passwordErrors.number ? "text-green-500" : "text-red-500"}>
                                    Al menos un número
                                </li>
                                <li className={passwordErrors.specialChar ? "text-green-500" : "text-red-500"}>
                                    Al menos un caracter especial (!@#$%^&*)
                                </li>
                            </ul>
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