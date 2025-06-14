import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from '../Landing'
// Función auxiliar para renderizar el componente con el router
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}
describe('LandingPage', () => {
    it('renderiza el componente correctamente', () => {
        renderWithRouter(<LandingPage />)
        // Verifica que el título principal esté presente usando el elemento h1
        const titleElement = screen.getByRole('heading', { level: 1, name: /saludify/i })
        expect(titleElement).toBeInTheDocument()
        // Verifica el título principal usando el elemento h2
        const mainTitle = screen.getByRole('heading', { level: 2, name: /transforma tu salud con tecnología/i })
        expect(mainTitle).toBeInTheDocument()
    })
    it('muestra el botón de inicio de sesión', () => {
        renderWithRouter(<LandingPage />)
        const loginButton = screen.getByRole('link', { name: /¡empieza ahora!/i })
        expect(loginButton).toBeInTheDocument()
        expect(loginButton).toHaveAttribute('href', '/login')
    })
    it('muestra los servicios ofrecidos', () => {
        renderWithRouter(<LandingPage />)
        // Verifica el título de la sección de servicios
        expect(screen.getByRole('heading', { name: /servicios ofrecidos/i })).toBeInTheDocument()
        // Verifica que los tres servicios estén presentes usando getAllByRole
        const serviceHeadings = screen.getAllByRole('heading', { name: /chat en tiempo real|seguimiento de datos|planificación de comidas/i })
        expect(serviceHeadings).toHaveLength(3)
    })
    it('muestra las descripciones de los servicios', () => {
        renderWithRouter(<LandingPage />)
        // Verifica las descripciones de los servicios
        expect(screen.getByText(/Conéctate con nutricionistas para recibir asesoramiento en tiempo real/)).toBeInTheDocument()
        expect(screen.getByText(/Monitorea tu progreso en dieta, ejercicio y sueño con nuestras herramientas de seguimiento/)).toBeInTheDocument()
        expect(screen.getByText(/Planifica tus comidas de acuerdo a tus preferencias y necesidades nutricionales/)).toBeInTheDocument()
    })
    it('muestra el logo de la aplicación', () => {
        renderWithRouter(<LandingPage />)
        const logo = screen.getByAltText('logo-salud')
        expect(logo).toBeInTheDocument()
    })
}) 