import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ListarPacientes from '../ListarPacientes'
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

// Mock simple de los componentes
vi.mock('../../components/Modals/Modal', () => ({
    default: function MockModal() {
        return <div data-testid="modal-paciente">Modal</div>
    }
}))

vi.mock('../../components/Modals/ConfirmBlockModal', () => ({
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

describe('ListarPacientes', () => {
    const mockPacientes = [
        {
            _id: '1',
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan@example.com',
            celular: '123456789',
            edad: '30',
            status: true,
            avatar: ''
        },
        {
            _id: '2',
            nombre: 'María',
            apellido: 'García',
            email: 'maria@example.com',
            celular: '987654321',
            edad: '25',
            status: false,
            avatar: ''
        }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue('mock-token')
        axios.get.mockResolvedValue({
            data: {
                success: true,
                pacientes: mockPacientes
            }
        })
    })

    it('renderiza el componente correctamente', async () => {
        renderWithRouter(<ListarPacientes />)

        // Verificar que se muestra el loading inicialmente
        expect(screen.getByText(/cargando pacientes/i)).toBeInTheDocument()

        // Esperar a que se carguen los datos
        await waitFor(() => {
            expect(screen.getByText('Listado de Pacientes')).toBeInTheDocument()
        })
    })

    it('muestra la lista de pacientes después de cargar', async () => {
        renderWithRouter(<ListarPacientes />)

        await waitFor(() => {
            expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        })

        expect(screen.getByText('María García')).toBeInTheDocument()
    })

    it('muestra el estado de los pacientes', async () => {
        renderWithRouter(<ListarPacientes />)

        await waitFor(() => {
            expect(screen.getByText('Activo')).toBeInTheDocument()
        })

        expect(screen.getByText('Inactivo')).toBeInTheDocument()
    })

    it('muestra avatares con iniciales cuando no hay imagen', async () => {
        renderWithRouter(<ListarPacientes />)

        await waitFor(() => {
            expect(screen.getByText('JP')).toBeInTheDocument()
        })

        expect(screen.getByText('MG')).toBeInTheDocument()
    })

    it('maneja errores de carga de pacientes', async () => {
        axios.get.mockRejectedValue(new Error('Error de red'))

        renderWithRouter(<ListarPacientes />)

        await waitFor(() => {
            expect(screen.getByText(/error de red/i)).toBeInTheDocument()
        })
    })

    it('muestra mensaje cuando no hay pacientes', async () => {
        axios.get.mockResolvedValue({
            data: {
                success: true,
                pacientes: []
            }
        })

        renderWithRouter(<ListarPacientes />)

        await waitFor(() => {
            expect(screen.getByText('No hay pacientes registrados')).toBeInTheDocument()
        })
    })

    it('renderiza la barra de búsqueda', async () => {
        renderWithRouter(<ListarPacientes />)

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Buscar pacientes...')).toBeInTheDocument()
        })
    })

    it('muestra información de contacto de los pacientes', async () => {
        renderWithRouter(<ListarPacientes />)

        await waitFor(() => {
            expect(screen.getByText('123456789')).toBeInTheDocument()
        })

        expect(screen.getByText('987654321')).toBeInTheDocument()
    })
}) 