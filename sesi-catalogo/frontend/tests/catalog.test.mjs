import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCourseFilters } from '../src/utils/filterCourses.ts'

const empty = { query: '', category: '', modality: '', status: '' }
test('parâmetros inválidos não aplicam filtros ocultos', () => {
  const filters = parseCourseFilters(new URLSearchParams('categoria=inexistente&modalidade=inexistente&status=inexistente'))
  assert.deepEqual(filters, empty)
})
test('validação preserva busca e filtros válidos junto de um inválido', () => {
  const params = new URLSearchParams({ busca: 'FISICA', categoria: 'ciencias-natureza', modalidade: 'Semipresencial', status: 'inexistente' })
  const filters = parseCourseFilters(params)
  assert.deepEqual(filters, { query: 'FISICA', category: 'ciencias-natureza', modality: 'Semipresencial', status: '' })
})
