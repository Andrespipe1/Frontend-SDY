import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ParametrosSalud from '../ParametrosSalud'
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

describe('ParametrosSalud', () => {
    const mockParametros = [
        {
            _id: '1',
            peso: '70',
            estatura: '175',
            nivelActividadFisica: 'Moderado',
            enfermedad: '',
            discapacidad: '',
            createdAt: '2024-01-15T10:00:00.000Z'
        },
        {
            _id: '2',
            peso: '72',
            estatura: '175',
            nivelActividadFisica: 'Alto',
            enfermedad: 'Diabetes',
            discapacidad: '',
            createdAt: '2024-01-20T10:00:00.000Z'
        }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        localStorageMock.getItem.mockReturnValue('mock-token')
        axios.get.mockResolvedValue({
            data: {
                parametros: mockParametros
            }
        })
    })

    it('renderiza el componente correctamente', async () => {
        renderWithRouter(<ParametrosSalud />)

        // Verificar que se muestra el loading inicialmente
        expect(screen.getByText(/cargando tus parámetros de salud/i)).toBeInTheDocument()

        // Esperar a que se carguen los datos
        await waitFor(() => {
            expect(screen.getByText('Registrar Nuevos Parámetros')).toBeInTheDocument()
        })
    })

    it('muestra el formulario de parámetros', async () => {
        renderWithRouter(<ParametrosSalud />)

        await waitFor(() => {
            expect(screen.getByText('Registrar Nuevos Parámetros')).toBeInTheDocument()
        })

        expect(screen.getByText('Peso (kg)')).toBeInTheDocument()
        expect(screen.getByText('Estatura (cm)')).toBeInTheDocument()
        expect(screen.getByText('Nivel de Actividad Física')).toBeInTheDocument()
    })

    it('muestra el historial de parámetros', async () => {
        renderWithRouter(<ParametrosSalud />)

        await waitFor(() => {
            expect(screen.getByText('Historial de Parámetros')).toBeInTheDocument()
        })

        expect(screen.getAllByText('70 kg')).toBeTruthy()
        expect(screen.getAllByText('175 cm')).toBeTruthy()
    })

    it('muestra el indicador de IMC', async () => {
        renderWithRouter(<ParametrosSalud />)

        await waitFor(() => {
            expect(screen.getByText('Indicadores')).toBeInTheDocument()
        })

        expect(screen.getAllByText('IMC')).toBeTruthy()
    })

    it('maneja errores de carga de datos', async () => {
        axios.get.mockRejectedValue(new Error('Error de red'))

        renderWithRouter(<ParametrosSalud />)

        await waitFor(() => {
            expect(screen.getByText(/error al obtener datos/i)).toBeInTheDocument()
        })
    })

    it('muestra mensaje cuando no hay historial', async () => {
        axios.get.mockResolvedValue({
            data: {
                parametros: []
            }
        })

        renderWithRouter(<ParametrosSalud />)

        await waitFor(() => {
            expect(screen.getByText('No hay registros históricos de parámetros')).toBeInTheDocument()
        })
    })

    it('renderiza el filtro por fecha', async () => {
        renderWithRouter(<ParametrosSalud />)

        await waitFor(() => {
            expect(screen.getByText('Buscar por fecha')).toBeInTheDocument()
        })
    })

    it('muestra el botón de guardar parámetros', async () => {
        renderWithRouter(<ParametrosSalud />)

        await waitFor(() => {
            expect(screen.getByText('Guardar Parámetros')).toBeInTheDocument()
        })
    })

    it('renderiza el componente sin token', () => {
        localStorageMock.getItem.mockReturnValue(null)

        renderWithRouter(<ParametrosSalud />)

        expect(screen.getByText(/debes iniciar sesión/i)).toBeInTheDocument()
    })
}) 