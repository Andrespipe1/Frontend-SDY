import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import FormularioComidas from '../Comidas'
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

// Mock de jwtDecode
vi.mock('jwt-decode', () => ({
    jwtDecode: vi.fn(() => ({ id: '123' }))
}))

// Mock de las variables de entorno
vi.mock('import.meta.env', () => ({
    VITE_BACKEND_URL: 'http://localhost:3000'
}))

// Mock de framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        p: ({ children, ...props }) => <p {...props}>{children}</p>
    }
}))

// Mock simple del componente modal
vi.mock('../../components/Modals/ConfirmDeleteModal', () => ({
    default: function MockConfirmModal() {
        return <div data-testid="confirm-modal">Confirm Modal</div>
    }
}))

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('FormularioComidas', () => {
    const mockPaciente = { nombre: 'Juan', apellido: 'Pérez' }
    const mockComidas = [
        {
            _id: '1',
            tipoComida: 'Desayuno',
            descripcion: 'Café con leche y tostadas',
            createdAt: '2024-01-15T10:00:00.000Z'
        },
        {
            _id: '2',
            tipoComida: 'Almuerzo',
            descripcion: 'Arroz con pollo',
            createdAt: '2024-01-15T14:00:00.000Z'
        }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue('mock-token')
        axios.get.mockResolvedValue({
            data: {
                paciente: mockPaciente,
                comidas: mockComidas
            }
        })
    })

    it('renderiza el componente correctamente', async () => {
        renderWithRouter(<FormularioComidas />)

        // Verificar que se muestra el loading inicialmente
        expect(screen.getByText(/cargando tus comidas/i)).toBeInTheDocument()

        // Esperar a que se carguen los datos
        await waitFor(() => {
            expect(screen.getByText('Registro de Alimentación')).toBeInTheDocument()
        })
    })

    it('muestra los inputs de comidas', async () => {
        renderWithRouter(<FormularioComidas />)

        await waitFor(() => {
            expect(screen.getAllByText('Desayuno').length).toBeGreaterThan(0)
        })

        expect(screen.getAllByText('Almuerzo').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Cena').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Snacks').length).toBeGreaterThan(0)
    })

    it('muestra el historial de comidas', async () => {
        renderWithRouter(<FormularioComidas />)

        await waitFor(() => {
            expect(screen.getByText('Historial de Comidas')).toBeInTheDocument()
        })

        expect(screen.getAllByText('Desayuno').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Almuerzo').length).toBeGreaterThan(0)
        expect(screen.getByText('Café con leche y tostadas')).toBeInTheDocument()
        expect(screen.getByText('Arroz con pollo')).toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay comidas', async () => {
        axios.get.mockResolvedValue({
            data: {
                paciente: mockPaciente,
                comidas: []
            }
        })

        renderWithRouter(<FormularioComidas />)

        await waitFor(() => {
            expect(screen.getByText('No hay comidas registradas')).toBeInTheDocument()
        })
    })

    it('muestra el filtro por fecha', async () => {
        renderWithRouter(<FormularioComidas />)

        await waitFor(() => {
            expect(screen.getByText('Buscar comidas por día')).toBeInTheDocument()
        })
    })

    it('maneja errores de carga de datos', async () => {
        axios.get.mockRejectedValue(new Error('Error de red'))

        renderWithRouter(<FormularioComidas />)

        await waitFor(() => {
            expect(screen.getByText(/error al obtener datos/i)).toBeInTheDocument()
        })
    })
}) 