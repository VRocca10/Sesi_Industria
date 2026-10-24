import type { Course } from '../../types/course'
import { Link } from 'react-router-dom'

export function CourseCard({ course, compact = false }: { course: Course; compact?: boolean }) {
  return (
    <article className={`course-card course-card--${course.category.id}`} aria-labelledby={`course-${course.id}`}>
      <img className="course-card-image" src={course.image} alt="" loading="lazy" decoding="async" width="290" height="420" />
      <div className="course-card-content">
        <span className="category-badge">
          <img src={course.category.icon} width="20" height="20" alt="" />
          {course.category.name}
        </span>
        <div className="course-card-copy">
          {compact && <span className="course-status">{course.status}</span>}
          <h3 id={`course-${course.id}`}><Link className="course-card-link" to={`/cursos/${course.id}`}>{compact ? course.shortName : course.fullName}</Link></h3>
          <p>{course.description}</p>
          {compact && <p className="course-card-meta">{course.modality} <span aria-hidden="true">·</span> {course.workloadHours} horas</p>}
        </div>
      </div>
    </article>
  )
}
