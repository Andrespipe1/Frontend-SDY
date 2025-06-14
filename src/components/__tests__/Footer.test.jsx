import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
    it('renderiza el footer correctamente', () => {
        render(<Footer />)

        // Verifica que el texto del copyright esté presente
        const copyrightText = screen.getByText(/© \d{4} Saludify. Todos los derechos reservados./)
        expect(copyrightText).toBeInTheDocument()
    })

    it('contiene el año actual', () => {
        render(<Footer />)
        const currentYear = new Date().getFullYear()
        const yearText = screen.getByText(new RegExp(currentYear.toString()))
        expect(yearText).toBeInTheDocument()
    })
}) 