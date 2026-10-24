import { useRef } from 'react'
import { useCourses } from '../../hooks/useCourses'
import { useCourseFilters } from '../../hooks/useCourseFilters'
import { filterCourses } from '../../utils/filterCourses'
import type { Course } from '../../types/course'
import { CatalogFilters } from './CatalogFilters'
import { CatalogResults } from './CatalogResults'

const emptyCourses: readonly Course[] = []

export function Courses() {
  const { state, retry } = useCourses()
  const { filters, hasFilters, updateFilter, clearFilters } = useCourseFilters()
  const searchInput = useRef<HTMLInputElement>(null)
  const courses = state.status === 'success' ? state.courses : emptyCourses
  const results = filterCourses(courses, filters)

  function clearAndFocus() {
    clearFilters()
    searchInput.current?.focus()
  }

  return (
    <section className="container course-catalog" aria-labelledby="catalog-title">
      <h1 id="catalog-title">Conheça nossos cursos</h1>
      <p>Escolha um curso para conhecer os detalhes e acessar suas aulas.</p>
      <CatalogFilters courses={courses} filters={filters} hasFilters={hasFilters} searchInput={searchInput} onChange={updateFilter} onClear={clearAndFocus} />
      <CatalogResults state={state} results={results} hasFilters={hasFilters} onRetry={retry} onClear={clearAndFocus} />
    </section>
  )
}
