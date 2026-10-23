import { Button } from '../../components/Button/Button'

export function Courses() {
  return (
    <section className="container placeholder-page" aria-labelledby="catalog-title">
      <p className="eyebrow">Próxima etapa</p>
      <h1 id="catalog-title">Catálogo de cursos</h1>
      <p>A listagem completa com pesquisa, filtros e detalhes será desenvolvida na próxima etapa. Nesta versão, conheça os cursos em destaque na página inicial.</p>
      <Button to="/#cursos" variant="outline">Conhecer os principais cursos</Button>
    </section>
  )
}
