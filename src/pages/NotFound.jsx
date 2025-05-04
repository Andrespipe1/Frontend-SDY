import {Link} from 'react-router-dom'


const NotFound = () => {
    return (
        

        <div className="flex flex-col items-center justify-center">

            <img class="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"/>

            <div className="flex flex-col items-center justify-center">
                
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">Page Not Found</p>
                
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">Lo sentimos la pagina no a sido encontrada.</p>
                
                <Link to="/login" className="p-3 m-5 w-full text-white text-center  bg-indigo-600  border rounded-xl hover:bg-indigo-500 hover:text-white">Regresar</Link>

            </div>
        </div>
    )
}
export default NotFound
