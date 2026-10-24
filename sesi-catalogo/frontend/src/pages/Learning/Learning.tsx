import { useCallback, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { courses } from '../../data/courses'
import type { Course } from '../../types/course'
import { LearningContent } from './LearningContent'
import { LearningSidebar } from './LearningSidebar'

export function Learning() {
  const { courseId } = useParams()
  const course = courses.find((item) => item.id === courseId)
  if (!course) return <section className="container placeholder-page"><h1>Curso não encontrado</h1><Link className="button button--outline" to="/cursos">Ver cursos</Link></section>
  if (course.status !== 'Disponível') return <Navigate to={`/cursos/${course.id}`} replace />
  return <CourseLearning key={course.id} course={course} />
}

function CourseLearning({ course }: { course: Course }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('boas-praticas')
  const modules = course.modules
  const lessons = useMemo(() => modules.flatMap((module) => module.lessons), [modules])
  const selectedLesson = lessons.find((lesson) => lesson.id === active)

  const selectLesson = useCallback((id: string) => {
    setActive(id)
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('lesson-content')?.focus({ preventScroll: true })
  }, [])

  return <div className="learning-page">
    <LearningSidebar course={course} active={active} query={query} onQueryChange={setQuery} onSelectLesson={selectLesson} />
    <LearningContent course={course} active={active} selectedLesson={selectedLesson} onSelectLesson={selectLesson} />
  </div>
}
