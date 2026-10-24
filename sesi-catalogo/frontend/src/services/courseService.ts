import { isAxiosError } from 'axios'
import { http } from './http'
import { parseCategories, parseCourse, parseCourseList } from '../utils/parseCourses'
import type { CourseFilters } from '../utils/filterCourses'

export async function getCourses(filters?: CourseFilters, signal?: AbortSignal) {
  const { data } = await http.get<unknown>('/courses', {
    signal,
    params: filters ? { search: filters.query, category: filters.category, modality: filters.modality, status: filters.status } : undefined,
  })
  return parseCourseList(data)
}

export async function getCourse(id: string, signal?: AbortSignal) {
  try {
    const { data } = await http.get<unknown>(`/courses/${encodeURIComponent(id)}`, { signal })
    return parseCourse(data)
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

export async function getCategories(signal?: AbortSignal) {
  const { data } = await http.get<unknown>('/categories', { signal })
  return parseCategories(data)
}
