import type { Course } from '../../types/course'

export function CourseAbout({ course }: { course: Course }) {
  const title = course.fullName
  return (
    <section className="container course-about" aria-labelledby="course-about-title">
      <div>
        <h2 id="course-about-title">Sobre o curso</h2>
        {course.id === 'matematica-precisao' ? <p>Explore nosso curso de {title}, perfeito para quem deseja se destacar nesse campo! Este programa abrangente foi desenvolvido para capacitar profissionais com as habilidades e conhecimentos fundamentais para garantir medições precisas e eficientes no ambiente metalúrgico.</p> : <p>Explore o curso {title}. {course.description} Desenvolvido para {course.targetAudience.charAt(0).toLowerCase() + course.targetAudience.slice(1)}</p>}
      </div>
      <div className="course-accordions">
        <details>
          <summary>Módulos<span aria-hidden="true" /></summary>
          <div className="course-accordion-content">
            {course.modules.map((module) => <div key={module.id}>
              <h3>{module.name}</h3>
              <ul>{module.lessons.map((lesson) => <li key={lesson.id}><strong>{lesson.name}</strong><p>{lesson.description}</p></li>)}</ul>
            </div>)}
          </div>
        </details>
        <details>
          <summary>Aulas online e avaliações<span aria-hidden="true" /></summary>
          <div className="course-accordion-content"><p>{course.description}</p><p>Modalidade: {course.modality}. Carga horária: {course.workloadHours} horas.</p><p>As informações sobre acesso às aulas e critérios de avaliação serão disponibilizadas na matrícula.</p></div>
        </details>
        <details>
          <summary>Dúvidas frequentes<span aria-hidden="true" /></summary>
          <div className="course-accordion-content">
            <h3>Para quem é este curso?</h3><p>{course.targetAudience}</p>
            <h3>Qual é a carga horária?</h3><p>O curso tem carga horária de {course.workloadHours} horas.</p>
            <h3>Como esclarecer outras dúvidas?</h3><p>Entre em contato pelo botão “Mandar uma mensagem” abaixo.</p>
          </div>
        </details>
      </div>
    </section>
  )
}
