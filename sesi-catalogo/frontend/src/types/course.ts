export type CourseCategoryId = 'matematica' | 'ciencias-natureza' | 'linguagens'
export type CourseModality = 'A distância' | 'Semipresencial'
export type CourseStatus = 'Disponível' | 'Em breve' | 'Encerrado'

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
  availableFrom?: string
  modules: CourseModule[]
}
