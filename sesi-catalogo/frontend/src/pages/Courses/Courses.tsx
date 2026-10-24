import { useRef } from 'react'
import { useCourses } from '../../hooks/useCourses'
import type { CourseState } from '../../hooks/useCourses'
import { useCategories } from '../../hooks/useCategories'
import { useCourseFilters } from '../../hooks/useCourseFilters'
import type { Course } from '../../types/course'
import { CatalogFilters } from './CatalogFilters'
import { CatalogResults } from './CatalogResults'

const emptyCourses: readonly Course[] = []

export function Courses() {
  const { filters, hasFilters, updateFilter, clearFilters } = useCourseFilters()
  const { state: courseState, retry: retryCourses } = useCourses(filters)
  const { state: categoryState, retry: retryCategories } = useCategories()
  const state: CourseState = categoryState.status === 'error' ? { status: 'error' }
    : categoryState.status === 'loading' ? { status: 'loading' } : courseState
  const searchInput = useRef<HTMLInputElement>(null)
  const results = state.status === 'success' ? state.courses : emptyCourses
  const categories = categoryState.status === 'success' ? categoryState.data : []

  function retry() { retryCourses(); retryCategories() }

  function clearAndFocus() {
    clearFilters()
    searchInput.current?.focus()
  }

  return (
    <section className="container course-catalog" aria-labelledby="catalog-title">
      <h1 id="catalog-title">Conheça nossos cursos</h1>
      <p>Escolha um curso para conhecer os detalhes e acessar suas aulas.</p>
      <CatalogFilters categories={categories} filters={filters} hasFilters={hasFilters} searchInput={searchInput} onChange={updateFilter} onClear={clearAndFocus} />
      <CatalogResults state={state} results={results} hasFilters={hasFilters} onRetry={retry} onClear={clearAndFocus} />
    </section>
  )
}
