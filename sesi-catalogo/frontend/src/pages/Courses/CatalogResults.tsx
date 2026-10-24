import { Search } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { CourseCard } from '../../components/CourseCard/CourseCard'
import type { Course } from '../../types/course'
import type { CourseState } from '../../hooks/useCourses'

interface Props {
  state: CourseState
  results: readonly Course[]
  hasFilters: boolean
  onRetry: () => void
  onClear: () => void
}

export function CatalogResults({ state, results, hasFilters, onRetry, onClear }: Props) {
  return <div id="catalog-results" aria-busy={state.status === 'loading'}>
    {state.status === 'loading' && <div className="catalog-feedback" role="status"><span className="catalog-spinner" aria-hidden="true" /><p>Carregando cursos…</p></div>}
    {state.status === 'error' && <div className="catalog-feedback" role="alert"><h2>Não foi possível carregar os cursos</h2><p>Tente novamente para continuar sua pesquisa.</p><Button variant="outline" onClick={onRetry}>Tentar novamente</Button></div>}
    {state.status === 'success' && <>
      <p className="catalog-result-count" role="status" aria-live="polite" aria-atomic="true">{results.length} {results.length === 1 ? 'curso encontrado' : 'cursos encontrados'}</p>
      {results.length > 0 ? <div className="course-catalog-grid">{results.map((course) => <CourseCard key={course.id} course={course} compact />)}</div> : <div className="catalog-feedback"><Search size={32} aria-hidden="true" /><h2>Nenhum curso encontrado</h2><p>Tente outro nome ou altere os filtros para encontrar um curso.</p>{hasFilters && <Button variant="outline" onClick={onClear}>Limpar filtros e ver cursos</Button>}</div>}
    </>}
  </div>
}
