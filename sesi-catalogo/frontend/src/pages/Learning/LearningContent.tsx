import { memo } from 'react'
import type { Course, Lesson } from '../../types/course'
import { GoodPractices } from './GoodPractices'

interface Props {
  course: Course
  active: string
  selectedLesson: Lesson | undefined
  onSelectLesson: (id: string) => void
}

export const LearningContent = memo(function LearningContent({ course, active, selectedLesson, onSelectLesson }: Props) {
  const title = course.fullName
  return (
    <article className="learning-content" id="lesson-content" tabIndex={-1}>
      <div className="learning-banner"><img src={course.image} alt="" width="960" height="534" /><img className="learning-banner-logo" src="/assets/logo-sesi.svg" alt="SESI" width="60" height="20" /></div>
      {active === 'boas-praticas' ? <GoodPractices course={course} /> : active === 'introducao' ? <><h1>Introdução</h1><p>Bem-vindo ao curso {title}. {course.description}</p><p>Explore os módulos no menu lateral para começar seu aprendizado.</p></> : active === 'extras' ? <><h1>Extras</h1><p>Revise as boas práticas de estudo e os temas dos módulos para complementar seu aprendizado em {course.shortName}.</p><button className="button button--outline" onClick={() => onSelectLesson('boas-praticas')}>Ver boas práticas</button></> : <><h1>{selectedLesson?.name}</h1><p>{selectedLesson?.description}</p></>}
    </article>
  )
})
