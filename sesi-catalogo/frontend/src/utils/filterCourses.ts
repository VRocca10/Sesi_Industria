import type { Course } from '../types/course'
import { courseCategoryIds, courseModalities, courseStatuses } from '../types/course.ts'
import { normalizeText } from './normalizeText.ts'

export interface CourseFilters { query: string; category: string; modality: string; status: string }

export const filterParameters = { query: 'busca', category: 'categoria', modality: 'modalidade', status: 'status' } as const

export function parseCourseFilters(params: URLSearchParams): CourseFilters {
  function validated(name: string, options: readonly string[]) {
    const value = params.get(name) ?? ''
    return options.includes(value) ? value : ''
  }

  return {
    query: params.get(filterParameters.query) ?? '',
    category: validated(filterParameters.category, courseCategoryIds),
    modality: validated(filterParameters.modality, courseModalities),
    status: validated(filterParameters.status, courseStatuses),
  }
}

export function filterCourses(courses: readonly Course[], filters: CourseFilters) {
  const query = normalizeText(filters.query)
  return courses.filter((course) =>
    (!query || [course.fullName, course.shortName, course.category.name].some((value) => normalizeText(value).includes(query))) &&
    (!filters.category || course.category.id === filters.category) &&
    (!filters.modality || course.modality === filters.modality) &&
    (!filters.status || course.status === filters.status),
  )
}
