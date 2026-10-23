import { courses } from '../data/courses'
import type { Course } from '../types/course'

// Contrato assíncrono para trocar os dados locais pela API sem mudar a interface.
// Na integração: validar o DTO recebido e usar o cliente de services/http.ts.
export async function getFeaturedCourses(): Promise<readonly Course[]> {
  return courses
}
