import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import type { Course } from '../../types/course'

export function EnrollmentButton({ course }: { course: Course }) {
  if (course.status !== 'Disponível') {
    return <Button className="course-enroll-action" disabled>{course.status === 'Em breve' ? 'Inscrições em breve' : 'Inscrições encerradas'}</Button>
  }
  return <Button className="course-enroll-action" to={`/aprender/${course.id}`}>Matricule-se <ArrowRight size={20} aria-hidden="true" /></Button>
}
