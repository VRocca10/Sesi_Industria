import { courseCategoryIds, courseModalities, courseStatuses } from '../types/course.ts'
import type { Course, CourseCategory, CourseList } from '../types/course'

function invalidResponse(): never {
  throw new Error('A API retornou dados de cursos inválidos.')
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalidResponse()
  return value as Record<string, unknown>
}

function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) return invalidResponse()
  return value
}

function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return invalidResponse()
  return value
}

export function parseCategory(value: unknown): CourseCategory {
  const category = record(value)
  const id = courseCategoryIds.find((candidate) => candidate === category.id)
  if (!id) return invalidResponse()
  return { id, name: text(category.name), icon: text(category.icon) }
}

export function parseCategories(value: unknown): readonly CourseCategory[] {
  return array(value).map(parseCategory)
}

export function parseCourse(value: unknown): Course {
  const course = record(value)
  const modality = courseModalities.find((candidate) => candidate === course.modality)
  const status = courseStatuses.find((candidate) => candidate === course.status)
  if (!modality || !status || typeof course.workloadHours !== 'number' || !Number.isInteger(course.workloadHours) || course.workloadHours <= 0) return invalidResponse()

  const date = course.availableFrom ?? null
  if (date !== null) {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return invalidResponse()
    const parsed = new Date(`${date}T00:00:00Z`)
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return invalidResponse()
  }

  return {
    id: text(course.id), fullName: text(course.fullName), shortName: text(course.shortName),
    description: text(course.description), category: parseCategory(course.category), modality,
    workloadHours: course.workloadHours, targetAudience: text(course.targetAudience), status,
    image: text(course.image), availableFrom: date,
    modules: array(course.modules).map((value) => {
      const module = record(value)
      return {
        id: text(module.id), name: text(module.name),
        lessons: array(module.lessons).map((value) => {
          const lesson = record(value)
          return { id: text(lesson.id), name: text(lesson.name), description: text(lesson.description) }
        }),
      }
    }),
  }
}

export function parseCourseList(value: unknown): CourseList {
  const response = record(value)
  const items = array(response.items).map(parseCourse)
  if (typeof response.total !== 'number' || !Number.isInteger(response.total) || response.total !== items.length) return invalidResponse()
  return { items, total: response.total }
}
