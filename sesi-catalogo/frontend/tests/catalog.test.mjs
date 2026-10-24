import test from 'node:test'
import assert from 'node:assert/strict'
import { filterCourses, parseCourseFilters } from '../src/utils/filterCourses.ts'
import { courses } from '../src/data/courses.ts'

const empty = { query: '', category: '', modality: '', status: '' }
test('parâmetros inválidos não aplicam filtros ocultos', () => {
  const filters = parseCourseFilters(new URLSearchParams('categoria=inexistente&modalidade=inexistente&status=inexistente'))
  assert.deepEqual(filters, empty)
  assert.equal(filterCourses(courses, filters).length, 6)
})
test('validação preserva busca e filtros válidos junto de um inválido', () => {
  const params = new URLSearchParams({ busca: 'FISICA', categoria: 'ciencias-natureza', modalidade: 'Semipresencial', status: 'inexistente' })
  const filters = parseCourseFilters(params)
  assert.deepEqual(filters, { query: 'FISICA', category: 'ciencias-natureza', modality: 'Semipresencial', status: '' })
  assert.deepEqual(filterCourses(courses, filters).map((course) => course.id), ['fisica-metalurgia'])
})
test('sem filtros retorna os seis cursos', () => {
  assert.equal(filterCourses(courses, empty).length, 6)
})
test('ciencia encontra Ciências da natureza com e sem acento', () => {
  for (const query of ['ciencia', 'ciência', 'CIENCIAS', 'Ciências da natureza']) {
    assert.deepEqual(filterCourses(courses, { ...empty, query }).map((course) => course.id), ['fisica-metalurgia', 'quimica-sustentabilidade'])
  }
  assert.deepEqual(filterCourses(courses, { ...empty, query: 'ciencia', modality: 'Semipresencial' }).map((course) => course.id), ['fisica-metalurgia'])
})
test('busca ignora acentos, caixa e espaços nas extremidades', () => {
  assert.equal(filterCourses(courses, { ...empty, query: '  FISICA  ' })[0]?.id, 'fisica-metalurgia')
})
test('pesquisa pelo nome breve e pelo nome completo', () => {
  for (const course of courses) {
    assert.ok(filterCourses(courses, { ...empty, query: course.shortName }).some((item) => item.id === course.id))
    assert.ok(filterCourses(courses, { ...empty, query: course.fullName }).some((item) => item.id === course.id))
  }
})
test('combina busca, categoria, modalidade e status com interseção', () => {
  const result = filterCourses(courses, { query: 'metalurgia', category: 'ciencias-natureza', modality: 'Semipresencial', status: 'Disponível' })
  assert.deepEqual(result.map((course) => course.id), ['fisica-metalurgia'])
})
test('cada filtro funciona independentemente', () => {
  assert.equal(filterCourses(courses, { ...empty, category: 'linguagens' }).length, 1)
  assert.equal(filterCourses(courses, { ...empty, modality: 'Semipresencial' }).length, 2)
  assert.equal(filterCourses(courses, { ...empty, status: 'Encerrado' }).length, 1)
})
test('combinação incompatível e nome inexistente retornam lista vazia', () => {
  assert.equal(filterCourses(courses, { ...empty, category: 'linguagens', status: 'Encerrado' }).length, 0)
  assert.equal(filterCourses(courses, { ...empty, query: 'astronomia' }).length, 0)
})
test('limpar filtros restaura a lista e não modifica os dados', () => {
  const snapshot = JSON.stringify(courses)
  filterCourses(courses, { ...empty, status: 'Encerrado' })
  assert.deepEqual(filterCourses(courses, empty), courses)
  assert.equal(JSON.stringify(courses), snapshot)
})
