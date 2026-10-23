import type { Course } from '../../types/course'

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className={`course-card course-card--${course.category.id}`} aria-labelledby={`course-${course.id}`}>
      <img className="course-card-image" src={course.image} alt="" loading="lazy" decoding="async" width="290" height="420" />
      <div className="course-card-content">
        <span className="category-badge">
          <img src={course.category.icon} width="20" height="20" alt="" />
          {course.category.name}
        </span>
        <div className="course-card-copy">
          <h3 id={`course-${course.id}`}>{course.fullName}</h3>
          <p>{course.description}</p>
        </div>
      </div>
    </article>
  )
}
