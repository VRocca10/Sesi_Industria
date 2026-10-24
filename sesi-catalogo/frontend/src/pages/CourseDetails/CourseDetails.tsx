import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowRight, Award, CalendarCheck, Play } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { TestimonialsSection } from '../../sections/TestimonialsSection/TestimonialsSection'
import { courses } from '../../data/courses'
import { CourseBenefits } from './CourseBenefits'
import { CourseAbout } from './CourseAbout'
import { EnrollmentButton } from './EnrollmentButton'
import { VideoDialog } from '../../components/VideoDialog/VideoDialog'

export function CourseDetails() {
  const { courseId } = useParams()
  const videoDialog = useRef<HTMLDialogElement>(null)
  const course = courses.find((item) => item.id === courseId)
  if (!course) return <section className="container placeholder-page"><h1>Curso não encontrado</h1><Button to="/cursos">Ver cursos</Button></section>
  const title = course.fullName
  const canEnroll = course.status === 'Disponível'
  const startDate = course.availableFrom ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${course.availableFrom}T00:00:00Z`)) : 'A definir'

  return (
    <div key={course.id} className={`course-details course-card--${course.category.id}`}>
      <section className="container course-details-hero" aria-labelledby="course-detail-title">
        <div className="course-details-copy">
          <span className="category-badge"><img src={course.category.icon} alt="" />{course.category.name}</span>
          <h1 id="course-detail-title">{title}</h1>
          <ul className="course-details-meta">
            <li><strong className="course-detail-status">{course.status}</strong></li>
            <li><CalendarCheck size={18} aria-hidden="true" /><span>Início do curso: <strong>{startDate}</strong></span></li>
            <li><Award size={18} aria-hidden="true" /><span>Certificação: <strong>SESI</strong></span></li>
            <li><span>Modalidade: <strong>{course.modality}</strong> · Carga horária: <strong>{course.workloadHours} horas</strong></span></li>
          </ul>
          <div className="course-enroll-primary"><EnrollmentButton course={course} /></div>
          {!canEnroll && <p className="course-enrollment-notice">{course.status === 'Em breve' ? 'As inscrições ainda não foram abertas para esta oferta.' : 'O período de inscrições desta oferta foi encerrado.'} <a href="/cursos">Conheça outros cursos.</a></p>}
        </div>
        <button className="career-video course-details-video" type="button" aria-label="Reproduzir apresentação do curso"
          aria-haspopup="dialog" onClick={() => videoDialog.current?.showModal()}>
          <img src="/assets/video-thumb.webp" width="784" height="441" alt="Profissionais trabalhando em uma máquina industrial" />
          <span className="career-play"><Play size={36} fill="currentColor" strokeWidth={0} aria-hidden="true" /></span>
        </button>
      </section>
      <CourseBenefits />
      <CourseAbout course={course} />
      <TestimonialsSection variant="course" />
      <section className="course-contact" aria-labelledby="course-contact-title">
        <div className="container">
          <p>Precisa de ajuda para decidir?</p>
          <h2 id="course-contact-title">Fale com a gente</h2>
          <a className="button button--light" href="mailto:contato@sesindustria.com.br">Mandar uma mensagem <ArrowRight size={20} aria-hidden="true" /></a>
        </div>
      </section>
      <aside className="container course-enrollment-bar" aria-label="Matrícula no curso">
        <p>{title}</p>
        <EnrollmentButton course={course} />
      </aside>
      <VideoDialog dialogRef={videoDialog} titleId="course-video-title" title="Apresentação do curso" unavailableMessage="O vídeo de apresentação estará disponível em breve." />
    </div>
  )
}
