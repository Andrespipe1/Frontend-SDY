import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'

// Mock del contexto de autenticación
vi.mock('../../context/AuthProvider', () => ({
    useAuth: () => ({ login: vi.fn() })
}))

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Login', () => {
    beforeEach(() => {
        mockNavigate.mockClear()
    })

    it('renderiza los campos y botones principales', () => {
        renderWithRouter(<Login />)
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /olvidaste tu contraseña/i })).toHaveAttribute('href', '/recuperar-password')
        expect(screen.getByRole('link', { name: /regístrate ahora/i })).toHaveAttribute('href', '/register')
    })

    it('permite mostrar y ocultar la contraseña', () => {
        renderWithRouter(<Login />)
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
}) 