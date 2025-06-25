import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Perfil from '../Perfil'
import axios from 'axios'

// Mock de axios
vi.mock('axios')

// Mock del contexto de autenticación
vi.mock('../../context/AuthProvider', () => ({
    useAuth: () => ({
        token: 'mock-token',
        login: vi.fn(),
        logout: vi.fn()
    })
}))

// Mock de generatePatientProfile
vi.mock('../../utils/generatePatientProfile', () => ({
    default: vi.fn().mockResolvedValue({
        save: vi.fn()
    })
}))

// Mock de URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')

// Mock de las variables de entorno
vi.mock('import.meta.env', () => ({
    VITE_BACKEND_URL: 'http://localhost:3000'
}))

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Perfil', () => {
    const mockPerfilData = {
        _id: '123',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        edad: '30',
        direccion: 'Av. Principal 123',
        celular: '123456789',
        avatar: ''
    }

    beforeEach(() => {
        vi.clearAllMocks()
        axios.get.mockResolvedValue({ data: mockPerfilData })
    })

    it('renderiza el componente correctamente', async () => {
        renderWithRouter(<Perfil />)

        // Verificar que se muestra el loading inicialmente
        expect(screen.getByText(/cargando tu perfil/i)).toBeInTheDocument()

        // Esperar a que se carguen los datos
        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })
    })

    it('muestra la información del perfil después de cargar', async () => {
        renderWithRouter(<Perfil />)

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })

        expect(screen.getByText('juan@example.com')).toBeInTheDocument()
        expect(screen.getByText('Paciente')).toBeInTheDocument()
    })

    it('muestra el avatar con iniciales', async () => {
        renderWithRouter(<Perfil />)

        await waitFor(() => {
            expect(screen.getByText('JP')).toBeInTheDocument()
        })
    })

    it('maneja errores de carga de perfil', async () => {
        axios.get.mockRejectedValue(new Error('Error de red'))

        renderWithRouter(<Perfil />)

        await waitFor(() => {
            expect(screen.getByText(/error al obtener el perfil/i)).toBeInTheDocument()
        })
    })

    it('muestra información de contacto', async () => {
        renderWithRouter(<Perfil />)

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })

        expect(screen.getByText('123456789')).toBeInTheDocument()
        expect(screen.getByText('juan@example.com')).toBeInTheDocument()
    })

    it('renderiza el componente con datos vacíos', async () => {
        const emptyPerfilData = {
            _id: '',
            nombre: '',
            apellido: '',
            email: '',
            edad: '',
            direccion: '',
            celular: '',
            avatar: ''
        }

        axios.get.mockResolvedValue({ data: emptyPerfilData })

        renderWithRouter(<Perfil />)

        await waitFor(() => {
            expect(screen.getByText('Paciente')).toBeInTheDocument()
        })
    })
}) 