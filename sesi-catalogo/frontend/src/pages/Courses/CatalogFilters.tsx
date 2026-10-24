import { useMemo } from 'react'
import type { RefObject } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import type { CourseCategory } from '../../types/course'
import { courseModalities, courseStatuses } from '../../types/course'
import type { CourseFilters } from '../../utils/filterCourses'

const modalityOptions = [{ value: '', label: 'Todas as modalidades' }, ...courseModalities.map((value) => ({ value, label: value }))]
const statusOptions = [{ value: '', label: 'Todos os status' }, ...courseStatuses.map((value) => ({ value, label: value }))]

interface Props {
  categories: readonly CourseCategory[]
  filters: CourseFilters
  hasFilters: boolean
  searchInput: RefObject<HTMLInputElement | null>
  onChange: (field: keyof CourseFilters, value: string) => void
  onClear: () => void
}

export function CatalogFilters({ categories, filters, hasFilters, searchInput, onChange, onClear }: Props) {
  const categoryOptions = useMemo(() => {
    return [{ value: '', label: 'Todas as categorias' }, ...categories.map((category) => ({ value: category.id, label: category.name }))]
  }, [categories])

  return (
    <form className="catalog-filters" aria-label="Pesquisar e filtrar cursos" onSubmit={(event) => event.preventDefault()}>
      <div className="catalog-filter-heading"><SlidersHorizontal size={20} aria-hidden="true" /><h2>Encontre seu curso</h2></div>
      <div className="catalog-filter-fields">
        <label className="catalog-search">Nome do curso<span><Search size={20} aria-hidden="true" /><input ref={searchInput} type="search" placeholder="O que você quer aprender?" value={filters.query} onChange={(event) => onChange('query', event.target.value)} aria-controls="catalog-results" /></span></label>
        <FilterSelect label="Categoria" value={filters.category} onChange={(value) => onChange('category', value)} options={categoryOptions} />
        <FilterSelect label="Modalidade" value={filters.modality} onChange={(value) => onChange('modality', value)} options={modalityOptions} />
        <FilterSelect label="Status" value={filters.status} onChange={(value) => onChange('status', value)} options={statusOptions} />
      </div>
      <div className="catalog-filter-footer"><p>Combine a pesquisa com os filtros para encontrar sua próxima oportunidade.</p><Button variant="outline" disabled={!hasFilters} onClick={onClear}>Limpar filtros</Button></div>
    </form>
  )
}
