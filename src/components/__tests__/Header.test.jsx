import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../Header'
import { useAuth } from '../../context/AuthProvider'

// Mock del contexto de autenticación
vi.mock('../../context/AuthProvider', () => ({
    useAuth: vi.fn(() => ({
        logout: vi.fn()
    }))
}))

describe('Header', () => {
    it('renderiza el header correctamente', () => {
        render(<Header />)
        expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('muestra el título SALUDIFY', () => {
        render(<Header />)
        expect(screen.getByText('SALUDIFY')).toBeInTheDocument()
    })

    it('muestra el botón de cerrar sesión', () => {
        render(<Header />)
        const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i })
        expect(logoutButton).toBeInTheDocument()
    })

    it('llama a la función logout al hacer clic en el botón', () => {
        const mockLogout = vi.fn()
        vi.mocked(useAuth).mockReturnValue({ logout: mockLogout })

        render(<Header />)
        const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i })
        fireEvent.click(logoutButton)

        expect(mockLogout).toHaveBeenCalledTimes(1)
    })
}) 