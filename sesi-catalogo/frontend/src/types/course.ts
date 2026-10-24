export const courseCategoryIds = ['matematica', 'ciencias-natureza', 'linguagens'] as const
export const courseModalities = ['A distância', 'Semipresencial'] as const
export const courseStatuses = ['Disponível', 'Em breve', 'Encerrado'] as const

export type CourseCategoryId = typeof courseCategoryIds[number]
export type CourseModality = typeof courseModalities[number]
export type CourseStatus = typeof courseStatuses[number]

export interface CourseCategory {
  id: CourseCategoryId
  name: string
  icon: string
}

export interface Lesson {
  id: string
  name: string
  description: string
}

export interface CourseModule {
  id: string
  name: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  fullName: string
  shortName: string
  description: string
  category: CourseCategory
  modality: CourseModality
  workloadHours: number
  targetAudience: string
  status: CourseStatus
  image: string
  availableFrom?: string | null
  modules: CourseModule[]
}

export interface CourseList {
  items: readonly Course[]
  total: number
}
