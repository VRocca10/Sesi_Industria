const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core')
const assert = require('node:assert/strict')
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5174'
const origin = new URL(base).origin
const coursesUrl = /\/api\/courses(?:\?.*)?$/

async function failure(route, status = 503, body = { title: 'Falha simulada', status }) {
  await route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': origin }, body: JSON.stringify(body) })
}

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    const fixtureRequests = []
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('request', (request) => {
      if (request.url().includes('/tests/fixtures/courses')) fixtureRequests.push(request.url())
    })

    await page.goto(`${base}/cursos?busca=ciencia`)
    await page.getByText('2 cursos encontrados', { exact: true }).waitFor()
    await page.getByRole('searchbox', { name: 'Nome do curso' }).fill('astronomia')
    await page.getByRole('heading', { name: 'Nenhum curso encontrado', exact: true }).waitFor()
    await page.getByRole('combobox', { name: 'Categoria', exact: true }).click()
    assert.equal(await page.getByRole('option').count(), 4)
    await page.keyboard.press('Escape')

    await page.goto(`${base}/cursos/curso-inexistente`)
    await page.getByRole('heading', { name: 'Curso não encontrado', exact: true }).waitFor()
    await page.goto(`${base}/aprender/curso-inexistente`)
    await page.getByRole('heading', { name: 'Curso não encontrado', exact: true }).waitFor()

    let failDetails = true
    await page.route(/\/api\/courses\/fisica-metalurgia$/, (route) => failDetails ? failure(route) : route.continue())
    await page.goto(`${base}/cursos/fisica-metalurgia`)
    await page.getByRole('heading', { name: 'Não foi possível carregar o curso', exact: true }).waitFor()
    failDetails = false
    await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click()
    await page.getByRole('heading', { name: 'Física do Movimento e da Energia na Metalurgia', exact: true }).waitFor()
    await page.waitForFunction(() => document.title.includes('Física na Metalurgia'))
    await page.unroute(/\/api\/courses\/fisica-metalurgia$/)

    let failCategories = true
    await page.route(/\/api\/categories$/, (route) => failCategories ? failure(route) : route.continue())
    await page.goto(`${base}/cursos`)
    await page.getByRole('heading', { name: 'Não foi possível carregar os cursos', exact: true }).waitFor()
    failCategories = false
    await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click()
    await page.getByText('6 cursos encontrados', { exact: true }).waitFor()
    await page.unroute(/\/api\/categories$/)

    await page.route(coursesUrl, (route) => failure(route, 200, { items: [{ id: 'incompleto' }], total: 1 }))
    await page.reload()
    await page.getByRole('heading', { name: 'Não foi possível carregar os cursos', exact: true }).waitFor()
    assert.equal(await page.locator('.course-catalog-grid article').count(), 0)
    await page.unroute(coursesUrl)

    await page.goto(`${base}/cursos`)
    await page.getByText('6 cursos encontrados', { exact: true }).waitFor()
    let releaseOldRequest
    const oldGate = new Promise((resolve) => { releaseOldRequest = resolve })
    let oldRequestStarted
    const started = new Promise((resolve) => { oldRequestStarted = resolve })
    let oldRequestFinished
    const finished = new Promise((resolve) => { oldRequestFinished = resolve })
    await page.route(coursesUrl, async (route) => {
      if (new URL(route.request().url()).searchParams.get('search') !== 'fisica') return route.continue()
      const response = await route.fetch()
      oldRequestStarted()
      await oldGate
      await route.fulfill({ response })
      oldRequestFinished()
    })
    const input = page.getByRole('searchbox', { name: 'Nome do curso' })
    await input.fill('fisica')
    await started
    await input.fill('geometria')
    await page.getByText('1 curso encontrado', { exact: true }).waitFor()
    await page.getByRole('link', { name: 'Geometria e Modelagem', exact: true }).waitFor()
    releaseOldRequest()
    await finished
    assert.equal(await page.getByRole('link', { name: 'Física na Metalurgia', exact: true }).count(), 0)
    await page.getByRole('link', { name: 'Geometria e Modelagem', exact: true }).waitFor()

    await page.route(/\/api\/courses\/matematica-precisao$/, async (route) => {
      const response = await route.fetch()
      const course = await response.json()
      course.fullName = 'Curso retornado pela API'
      course.shortName = 'Título remoto'
      course.modules[0].name = 'Módulo retornado pela API'
      course.modules[0].lessons[0].name = 'Aula retornada pela API'
      course.modules[0].lessons[0].description = 'Descrição retornada pela API.'
      await route.fulfill({ response, json: course })
    })
    await page.goto(`${base}/cursos/matematica-precisao`)
    await page.getByRole('heading', { name: 'Curso retornado pela API', exact: true }).waitFor()
    await page.waitForFunction(() => document.title.startsWith('Título remoto'))
    await page.getByRole('link', { name: 'Matricule-se', exact: true }).first().click()
    await page.locator('.learning-course-name').getByText('Curso retornado pela API', { exact: true }).waitFor()
    await page.getByText('2. Módulo 1', { exact: true }).click()
    await page.getByRole('heading', { name: 'Módulo retornado pela API', exact: true }).waitFor()
    await page.getByRole('button', { name: '2.1 Aula retornada pela API', exact: true }).click()
    await page.getByRole('heading', { name: 'Aula retornada pela API', exact: true }).waitFor()
    await page.getByText('Descrição retornada pela API.', { exact: true }).waitFor()

    assert.deepEqual(fixtureRequests, [])
    assert.deepEqual(errors, [])
    console.log('PASS: API real, categorias persistentes, 404, recuperação de erros, contrato inválido, títulos e respostas fora de ordem sem fallback local.')
  } finally { await browser.close() }
})().catch((error) => { console.error(error); process.exitCode = 1 })
