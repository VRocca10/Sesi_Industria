import { useCallback } from 'react'
import { getCourses } from '../services/courseService'
import type { Course } from '../types/course'
import type { CourseFilters } from '../utils/filterCourses'
import { useDebouncedValue } from './useDebouncedValue'
import { useRemoteResource } from './useRemoteResource'

export type CourseState =
  | { status: 'loading' }
  | { status: 'success'; courses: readonly Course[]; total: number }
  | { status: 'error' }

const emptyFilters: CourseFilters = { query: '', category: '', modality: '', status: '' }

export function useCourses(filters: CourseFilters = emptyFilters) {
  const { query, category, modality, status } = filters
  const search = useDebouncedValue(query, 250)
  const load = useCallback((signal: AbortSignal) => getCourses({ query: search, category, modality, status }, signal), [search, category, modality, status])
  const resource = useRemoteResource(load)

  const state: CourseState = query !== search ? { status: 'loading' }
    : resource.state.status === 'success' ? { status: 'success', courses: resource.state.data.items, total: resource.state.data.total }
    : resource.state
  return { state, retry: resource.retry }
}
