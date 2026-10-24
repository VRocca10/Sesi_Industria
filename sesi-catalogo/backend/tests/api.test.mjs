import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const base = process.env.API_BASE_URL ?? 'http://localhost:5000'
const seed = JSON.parse(readFileSync(new URL('../Sesi.Catalogo.Api/Data/Seed/catalog.json', import.meta.url), 'utf8'))
const expectedCourses = seed.courses.map((course) => {
  const { categoryId, ...fields } = course
  return {
    ...fields,
    category: seed.categories.find((category) => category.id === categoryId),
    availableFrom: course.availableFrom ?? null,
    modules: seed.modules.filter((module) => module.courseId === course.id).sort((a, b) => a.position - b.position)
      .map((module) => ({
        id: module.id,
        name: module.name,
        lessons: seed.lessons.filter((lesson) => lesson.courseId === course.id && lesson.moduleId === module.id)
          .sort((a, b) => a.position - b.position)
          .map(({ id, name, description }) => ({ id, name, description })),
      })),
  }
})

async function get(path, query = {}) {
  const url = new URL(path, base)
  url.search = new URLSearchParams(query).toString()
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
  assert.match(response.headers.get('content-type') ?? '', /application\/(?:problem\+)?json/)
  return { status: response.status, body: await response.json() }
}

async function expectCourses(query, expectedIds) {
  const { status, body } = await get('/api/courses', query)
  assert.equal(status, 200)
  assert.equal(body.total, expectedIds.length)
  assert.deepEqual(body.items.map((course) => course.id).sort(), [...expectedIds].sort())
}

test('listagem contém os seis cursos completos e módulos/aulas na ordem original', async () => {
  const { status, body } = await get('/api/courses')
  assert.equal(status, 200)
  assert.equal(body.total, 6)
  assert.deepEqual(body.items.sort((a, b) => a.id.localeCompare(b.id)), expectedCourses.sort((a, b) => a.id.localeCompare(b.id)))
})

for (const course of expectedCourses) {
  test(`detalhes de ${course.id}`, async () => {
    const { status, body } = await get(`/api/courses/${course.id}`)
    assert.equal(status, 200)
    assert.deepEqual(body, course)
  })
}

test('categorias retornam os três identificadores, nomes e ícones', async () => {
  const { status, body } = await get('/api/categories')
  assert.equal(status, 200)
  assert.deepEqual(body.sort((a, b) => a.id.localeCompare(b.id)), [...seed.categories].sort((a, b) => a.id.localeCompare(b.id)))
})

for (const search of ['fisica', 'FÍSICA', '  Física  ', 'Fi\u0301sica']) {
  test(`busca sem distinção de caixa/acentos: ${JSON.stringify(search)}`, () => expectCourses({ search }, ['fisica-metalurgia']))
}
for (const search of ['ciencia', 'Ciência', 'CIÊNCIAS DA NATUREZA']) {
  test(`pesquisa pela categoria: ${search}`, () => expectCourses({ search }, ['fisica-metalurgia', 'quimica-sustentabilidade']))
}

test('pesquisa pelo nome breve', () => expectCourses({ search: 'Estatística na Produção' }, ['estatistica-qualidade']))
test('filtro de categoria', () => expectCourses({ category: 'linguagens' }, ['comunicacao-industria']))
test('filtro de modalidade', () => expectCourses({ modality: 'Semipresencial' }, ['geometria-textil', 'fisica-metalurgia']))
test('filtro de status', () => expectCourses({ status: 'Encerrado' }, ['quimica-sustentabilidade']))
test('pesquisa e os três filtros combinados', () => expectCourses({ search: 'metalurgia', category: 'ciencias-natureza', modality: 'Semipresencial', status: 'Disponível' }, ['fisica-metalurgia']))
test('combinação incompatível retorna lista vazia', () => expectCourses({ category: 'linguagens', status: 'Encerrado' }, []))
test('nome inexistente retorna lista vazia', () => expectCourses({ search: 'astronomia' }, []))
test('categoria inexistente retorna lista vazia', () => expectCourses({ category: 'inexistente' }, []))
test('campos vazios e pesquisa com espaços não filtram', () => expectCourses({ search: '  ', category: '', modality: '', status: '' }, expectedCourses.map((course) => course.id)))

for (const search of ['%', '_', '\\', "'; DROP TABLE Courses; --"]) {
  test(`pesquisa trata caracteres especiais como texto literal: ${JSON.stringify(search)}`, () => expectCourses({ search }, []))
}

for (const query of [{ modality: 'Online' }, { status: 'Inexistente' }, { search: 'a'.repeat(201) }, { category: 'a'.repeat(101) }]) {
  test(`parâmetro inválido: ${Object.keys(query)[0]}`, async () => {
    const { status, body } = await get('/api/courses', query)
    assert.equal(status, 400)
    assert.equal(body.status, 400)
    assert.ok(Object.keys(body.errors).length > 0)
  })
}

test('curso inexistente retorna 404 com ProblemDetails', async () => {
  const { status, body } = await get('/api/courses/inexistente')
  assert.equal(status, 404)
  assert.equal(body.status, 404)
  assert.equal(body.title, 'Curso não encontrado.')
})

test('o contrato não publica gerenciamento de cursos', async () => {
  for (const [method, path] of [['POST', '/api/courses'], ['PUT', '/api/courses/matematica-precisao'], ['DELETE', '/api/courses/matematica-precisao']]) {
    const response = await fetch(new URL(path, base), { method, signal: AbortSignal.timeout(15000) })
    assert.equal(response.status, 405)
  }
})
