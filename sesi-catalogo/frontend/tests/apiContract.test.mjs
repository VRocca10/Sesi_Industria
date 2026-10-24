import test from 'node:test'
import assert from 'node:assert/strict'
import { courses } from './fixtures/courses.ts'
import { parseCourse, parseCourseList, parseCategories } from '../src/utils/parseCourses.ts'

test('aceita o contrato de cursos e a data ausente como null', () => {
  const payload = { items: courses.map((course) => ({ ...course, availableFrom: course.availableFrom ?? null })), total: courses.length }
  assert.deepEqual(parseCourseList(payload), payload)
})
test('rejeita total incoerente, resposta vazia e formato antigo de lista', () => {
  for (const payload of [null, {}, courses, { items: [], total: 1 }, { items: [], total: -1 }]) assert.throws(() => parseCourseList(payload))
})
test('aceita lista vazia válida', () => assert.deepEqual(parseCourseList({ items: [], total: 0 }), { items: [], total: 0 }))
test('rejeita dados que poderiam quebrar a tela de detalhes', () => {
  for (const override of [{ workloadHours: 0 }, { status: 'inválido' }, { modality: 'inválido' }, { modules: null }, { availableFrom: '2026-02-31' }, { availableFrom: '2026-99-99' }, { availableFrom: 'data inválida' }, { fullName: '' }]) assert.throws(() => parseCourse({ ...courses[0], ...override }))
})
test('rejeita categoria e aula incompletas', () => {
  assert.throws(() => parseCategories([{ id: 'matematica', name: 'Matemática' }]))
  assert.throws(() => parseCourse({ ...courses[0], modules: [{ id: 'm', name: 'Módulo', lessons: [{ id: 'a', name: 'Aula' }] }] }))
})
