import { courses } from '../data/courses'
import type { Course } from '../types/course'

export async function getCourses(): Promise<readonly Course[]> {
  return courses
}
