import { courseCategoryIds, courseModalities, courseStatuses } from '../types/course.ts'

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
