import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Circle, CircleCheck, CirclePlay, Search } from 'lucide-react'
import type { Course } from '../../types/course'
import { normalizeText } from '../../utils/normalizeText'

const introduction = [
  { id: 'introducao', name: '1.1 Introdução' },
  { id: 'boas-praticas', name: '1.2 Boas práticas' },
  { id: 'extras', name: '1.3 Extras' },
]

interface Props {
  course: Course
  active: string
  query: string
  onQueryChange: (query: string) => void
  onSelectLesson: (id: string) => void
}

function LessonButton({ id, name, active, onSelect }: { id: string; name: string; active: string; onSelect: (id: string) => void }) {
  const Icon = id === 'introducao' ? CircleCheck : active === id ? CirclePlay : Circle
  return <button type="button" className="learning-lesson" aria-current={active === id ? 'page' : undefined} onClick={() => onSelect(id)}>
    <Icon size={17} fill={id === 'introducao' ? 'currentColor' : 'none'} aria-hidden="true" /><span>{name}</span>
  </button>
}

export function LearningSidebar({ course, active, query, onQueryChange, onSelectLesson }: Props) {
  const { visibleIntroduction, visibleModules, hasResults } = useMemo(() => {
    const term = normalizeText(query)
    const matches = (name: string) => normalizeText(name).includes(term)
    const visibleIntroduction = introduction.filter((lesson) => matches(lesson.name))
    const visibleModules = course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson, index) => ({ ...lesson, number: index + 1 })).filter((lesson) => matches(lesson.name)),
    }))
    return { visibleIntroduction, visibleModules, hasResults: visibleIntroduction.length > 0 || visibleModules.some((module) => module.lessons.length > 0) }
  }, [course.modules, query])

  return <aside className="learning-sidebar" aria-label="Navegação do curso">
    <div className="learning-course-header">
      <Link className="learning-back" to={`/cursos/${course.id}`} aria-label="Voltar à página do curso"><ArrowLeft size={20} aria-hidden="true" /></Link>
      <div className="learning-course-name"><p>Certificação</p><h2>{course.fullName}</h2></div>
      <div className="learning-progress"><progress value={10} max={100} aria-label="Progresso do curso" /><span>10%</span></div>
    </div>
    <div className="learning-search"><label className="sr-only" htmlFor="lesson-search">Buscar aulas</label><input id="lesson-search" type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} /><Search size={17} aria-hidden="true" /></div>
    <nav aria-label="Aulas">
      {visibleIntroduction.length > 0 && <div className="learning-introduction"><h3>1. Introdução</h3>{visibleIntroduction.map((lesson) => <LessonButton key={lesson.id} {...lesson} active={active} onSelect={onSelectLesson} />)}</div>}
      {visibleModules.map((module, index) => {
        if (query.trim() && module.lessons.length === 0) return null
        return <details key={module.id} className="learning-module" open={query.trim() ? true : undefined}>
          <summary>{index + 2}. Módulo {index + 1}</summary>
          <h4>{module.name}</h4>
          {module.lessons.map((lesson) => <LessonButton key={lesson.id} id={lesson.id} name={`${index + 2}.${lesson.number} ${lesson.name}`} active={active} onSelect={onSelectLesson} />)}
        </details>
      })}
      {!hasResults && <p className="learning-pending" role="status">Nenhuma aula encontrada.</p>}
    </nav>
  </aside>
}
