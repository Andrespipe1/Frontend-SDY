import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Citas from '../Citas'
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
    jwtDecode: vi.fn(() => ({ id: '123', rol: 'paciente' }))
}))

// Mock de las variables de entorno
vi.mock('import.meta.env', () => ({
    VITE_BACKEND_URL: 'http://localhost:3000'
}))

// Mock de los componentes modales
vi.mock('../../components/Modals/ConfirmDeleteModal', () => ({
    default: function MockConfirmDeleteModal() {
        return <div data-testid="confirm-delete-modal">Confirm Delete Modal</div>
    }
}))

vi.mock('../../components/Modals/ConfirmCancelModal', () => ({
    default: function MockConfirmCancelModal() {
        return <div data-testid="confirm-cancel-modal">Confirm Cancel Modal</div>
    }
}))

// Mock de los componentes de alertas
vi.mock('../../components/Alerts/Mensaje', () => ({
    default: function MockMensaje({ children }) {
        return <div data-testid="mensaje">{children}</div>
    }
}))

// Mock de react-icons
vi.mock('react-icons/fa', () => ({
    FaCalendarAlt: () => <span>FaCalendarAlt</span>,
    FaClock: () => <span>FaClock</span>,
    FaTrash: () => <span>FaTrash</span>,
    FaCheck: () => <span>FaCheck</span>,
    FaTimes: () => <span>FaTimes</span>,
    FaSearch: () => <span>FaSearch</span>,
    FaVideo: () => <span>FaVideo</span>,
    FaMapMarkerAlt: () => <span>FaMapMarkerAlt</span>
}))

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Citas', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue('mock-token')
    })

    it('renderiza el componente correctamente', async () => {
        const mockPerfilData = {
            _id: '123',
            nombre: 'Juan',
            apellido: 'Pérez',
            role: 'paciente'
        }

        const mockNutricionistas = [
            { _id: 'nutri1', nombre: 'Ana', apellido: 'García' }
        ]

        const mockCitas = []

        axios.get
            .mockResolvedValueOnce({ data: mockPerfilData }) // perfil
            .mockResolvedValueOnce({ data: mockNutricionistas }) // nutricionistas
            .mockResolvedValueOnce({ data: mockCitas }) // citas

        renderWithRouter(<Citas />)

        await waitFor(() => {
            expect(screen.getByText('Cargando tus citas...')).toBeInTheDocument()
        })

        await waitFor(() => {
            expect(screen.getByText('Mis Citas')).toBeInTheDocument()
        })
    })

    it('muestra el formulario de solicitud para pacientes', async () => {
        const mockPerfilData = {
            _id: '123',
            nombre: 'Juan',
            apellido: 'Pérez',
            role: 'paciente'
        }

        const mockNutricionistas = [
            { _id: 'nutri1', nombre: 'Ana', apellido: 'García' }
        ]

        const mockCitas = []

        axios.get
            .mockResolvedValueOnce({ data: mockPerfilData })
            .mockResolvedValueOnce({ data: mockNutricionistas })
            .mockResolvedValueOnce({ data: mockCitas })

        renderWithRouter(<Citas />)

        await waitFor(() => {
            expect(screen.getByText('Solicitar Nueva Cita')).toBeInTheDocument()
        })

        expect(screen.getByText('Nutricionista')).toBeInTheDocument()
        expect(screen.getByText('Modalidad')).toBeInTheDocument()
        expect(screen.getByText('Descripción')).toBeInTheDocument()
    })

    it('muestra la lista de citas', async () => {
        const mockPerfilData = {
            _id: '123',
            nombre: 'Juan',
            apellido: 'Pérez',
            role: 'paciente'
        }

        const mockNutricionistas = [
            { _id: 'nutri1', nombre: 'Ana', apellido: 'García' }
        ]

        const mockCitas = [
            {
                _id: 'cita1',
                paciente: { nombre: 'Juan', apellido: 'Pérez' },
                nutricionista: { nombre: 'Ana', apellido: 'García' },
                descripcion: 'Consulta de nutrición',
                estado: 'pendiente',
                modalidad: 'presencial',
                fecha: null
            }
        ]

        axios.get
            .mockResolvedValueOnce({ data: mockPerfilData })
            .mockResolvedValueOnce({ data: mockNutricionistas })
            .mockResolvedValueOnce({ data: mockCitas })

        renderWithRouter(<Citas />)

        await waitFor(() => {
            expect(screen.getAllByText('Ana García').length).toBeGreaterThan(0)
        })

        expect(screen.getByText('Consulta de nutrición')).toBeInTheDocument()
        expect(screen.getByText('pendiente')).toBeInTheDocument()
    })

    it('muestra el buscador de citas', async () => {
        const mockPerfilData = {
            _id: '123',
            nombre: 'Juan',
            apellido: 'Pérez',
            role: 'paciente'
        }

        const mockNutricionistas = [
            { _id: 'nutri1', nombre: 'Ana', apellido: 'García' }
        ]

        const mockCitas = []

        axios.get
            .mockResolvedValueOnce({ data: mockPerfilData })
            .mockResolvedValueOnce({ data: mockNutricionistas })
            .mockResolvedValueOnce({ data: mockCitas })

        renderWithRouter(<Citas />)

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Buscar citas...')).toBeInTheDocument()
        })
    })

    it('muestra mensaje cuando no hay citas', async () => {
        const mockPerfilData = {
            _id: '123',
            nombre: 'Juan',
            apellido: 'Pérez',
            role: 'paciente'
        }

        const mockNutricionistas = [
            { _id: 'nutri1', nombre: 'Ana', apellido: 'García' }
        ]

        const mockCitas = []

        axios.get
            .mockResolvedValueOnce({ data: mockPerfilData })
            .mockResolvedValueOnce({ data: mockNutricionistas })
            .mockResolvedValueOnce({ data: mockCitas })

        renderWithRouter(<Citas />)

        await waitFor(() => {
            expect(screen.getByText('No hay citas registradas')).toBeInTheDocument()
        })
    })
}) 