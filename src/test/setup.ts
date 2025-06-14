import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpia después de cada prueba
afterEach(() => {
  cleanup()
}) 