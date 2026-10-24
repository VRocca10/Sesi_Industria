import { CourseCarousel } from '../../components/CourseCarousel/CourseCarousel'
import { Button } from '../../components/Button/Button'
import { useCourses } from '../../hooks/useCourses'

export function FeaturedCourses() {
  const { state, retry } = useCourses()
  return (
    <section id="cursos" className="featured-courses" aria-labelledby="featured-title" aria-busy={state.status === 'loading'}>
      <div className="container"><h2 id="featured-title">Principais cursos</h2></div>
      {state.status === 'loading' && <p className="container course-message" role="status">Carregando cursos…</p>}
      {state.status === 'error' && (
        <div className="container course-message" role="alert">
          <p>Não foi possível carregar os cursos. Tente novamente.</p>
          <Button variant="outline" onClick={retry}>Tentar novamente</Button>
        </div>
      )}
      {state.status === 'success' && (state.courses.length > 0
        ? <CourseCarousel courses={state.courses} />
        : <p className="container course-message" role="status">Nenhum curso encontrado.</p>)}
    </section>
  )
}
