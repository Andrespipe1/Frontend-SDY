import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PerfilNutri from '../PerfilNutri'
import axios from 'axios'

// Mock de axios
vi.mock('axios')

// Mock de localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
global.localStorage = localStorageMock

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

describe('PerfilNutri', () => {
    const mockPerfilData = {
        _id: '456',
        nombre: 'María',
        apellido: 'García',
        email: 'maria@example.com',
        edad: '35',
        direccion: 'Calle Nutrición 456',
        celular: '987654321'
    }

    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue('mock-token')
        axios.get.mockResolvedValue({ data: mockPerfilData })
    })

    it('renderiza el componente correctamente', async () => {
        renderWithRouter(<PerfilNutri />)

        // Verificar que se muestra el loading inicialmente
        expect(screen.getByText(/cargando tu perfil/i)).toBeInTheDocument()

        // Esperar a que se carguen los datos
        await waitFor(() => {
            expect(screen.getByText('María García')).toBeInTheDocument()
        })
    })

    it('muestra la información del perfil después de cargar', async () => {
        renderWithRouter(<PerfilNutri />)

        await waitFor(() => {
            expect(screen.getByText('María García')).toBeInTheDocument()
        })

        expect(screen.getByText('maria@example.com')).toBeInTheDocument()
        expect(screen.getByText('Nutricionista')).toBeInTheDocument()
    })

    it('muestra el avatar con iniciales', async () => {
        renderWithRouter(<PerfilNutri />)

        await waitFor(() => {
            expect(screen.getByText('MG')).toBeInTheDocument()
        })
    })

    it('maneja errores de carga de perfil', async () => {
        axios.get.mockRejectedValue(new Error('Error de red'))

        renderWithRouter(<PerfilNutri />)

        await waitFor(() => {
            expect(screen.getByText(/error al obtener el perfil/i)).toBeInTheDocument()
        })
    })

    it('muestra información de contacto', async () => {
        renderWithRouter(<PerfilNutri />)

        await waitFor(() => {
            expect(screen.getByText('María García')).toBeInTheDocument()
        })

        expect(screen.getByText('987654321')).toBeInTheDocument()
        expect(screen.getByText('maria@example.com')).toBeInTheDocument()
    })

    it('renderiza el componente con datos vacíos', async () => {
        const emptyPerfilData = {
            _id: '',
            nombre: '',
            apellido: '',
            email: '',
            edad: '',
            direccion: '',
            celular: ''
        }

        axios.get.mockResolvedValue({ data: emptyPerfilData })

        renderWithRouter(<PerfilNutri />)

        await waitFor(() => {
            expect(screen.getByText('Nutricionista')).toBeInTheDocument()
        })
    })
}) 