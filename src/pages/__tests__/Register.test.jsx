import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Register from '../Register'

// Mock de axios para simular la respuesta del servidor
vi.mock('axios', () => ({
    default: {
        post: vi.fn()
    }
}))

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Register', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renderiza los campos principales', () => {
        renderWithRouter(<Register />)
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/edad/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/celular/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
    })

    it('permite mostrar y ocultar la contraseña', () => {
        renderWithRouter(<Register />)
        const passwordInput = screen.getByLabelText(/contraseña/i)
        const toggleButton = screen.getByRole('button', { name: '' })
        // Por defecto debe ser tipo password
        expect(passwordInput).toHaveAttribute('type', 'password')
        // Click para mostrar
        fireEvent.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'text')
        // Click para ocultar
        fireEvent.click(toggleButton)
        expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('muestra los requisitos de la contraseña', () => {
        renderWithRouter(<Register />)
        expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument()
        expect(screen.getByText(/al menos una mayúscula/i)).toBeInTheDocument()
        expect(screen.getByText(/al menos una minuscula/i)).toBeInTheDocument()
        expect(screen.getByText(/al menos un número/i)).toBeInTheDocument()
        expect(screen.getByText(/al menos un caracter especial/i)).toBeInTheDocument()
    })

    it('muestra el enlace para iniciar sesión', () => {
        renderWithRouter(<Register />)
        const loginLink = screen.getByRole('link', { name: /inicia sesión/i })
        expect(loginLink).toBeInTheDocument()
        expect(loginLink).toHaveAttribute('href', '/login')
    })
}) 