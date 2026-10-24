import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CourseFilters } from '../utils/filterCourses'
import { filterParameters, parseCourseFilters } from '../utils/filterCourses'

const navigationOptions = { replace: true, preventScrollReset: true }

export function useCourseFilters() {
  const [params, setParams] = useSearchParams()
  const filters = parseCourseFilters(params)

  useEffect(() => {
    const validated = parseCourseFilters(params)
    const next = new URLSearchParams(params)
    let changed = false
    for (const field of ['category', 'modality', 'status'] as const) {
      const name = filterParameters[field]
      if (params.has(name) && params.get(name) !== validated[field]) {
        next.delete(name)
        changed = true
      }
    }
    if (changed) setParams(next, navigationOptions)
  }, [params, setParams])

  function updateFilter(field: keyof CourseFilters, value: string) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(filterParameters[field], value)
      else next.delete(filterParameters[field])
      return next
    }, navigationOptions)
  }

  function clearFilters() {
    setParams({}, navigationOptions)
  }

  return { filters, hasFilters: Object.values(filters).some(Boolean), updateFilter, clearFilters }
}
