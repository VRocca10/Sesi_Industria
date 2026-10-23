import { useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'

const testimonials = [
  {
    quote: 'A experiência do curso foi incrível! As aulas foram muito bem estruturadas e o cronograma foi cuidadosamente planejado, facilitando muito o aprendizado.',
    name: 'Lucas Pereira', role: 'Analista na Empresa X',
  },
  {
    quote: 'Concluir o curso foi uma jornada enriquecedora. As aulas eram dinâmicas e o horário foi organizado para maximizar nosso tempo de estudo.',
    name: 'Mariana Costa', role: 'Gestora na Empresa X',
  },
  {
    quote: 'O curso superou minhas expectativas! As aulas eram bem elaboradas e o planejamento do horário ajudou a manter o foco e a produtividade.',
    name: 'Thiago Almeida', role: 'Técnico na Empresa X',
  },
  {
    quote: 'Finalizar o curso foi uma experiência motivadora. As aulas foram muito bem preparadas e o cronograma foi ideal para o aprendizado.',
    name: 'Fernanda Silva', role: 'Analista na Empresa X',
  },
  {
    quote: 'A conclusão do curso foi uma etapa muito gratificante. As aulas bem organizadas e o horário flexível ajudaram a facilitar meu aprendizado.',
    name: 'Gabriel Santos', role: 'Analista na Empresa X',
  },
]

export function TestimonialsSection() {
  const id = useId()
  const swiper = useRef<SwiperInstance | null>(null)
  const [index, setIndex] = useState(0)

  function move(direction: 'previous' | 'next') {
    const speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350
    if (direction === 'previous') swiper.current?.slidePrev(speed)
    else swiper.current?.slideNext(speed)
  }

  return (
    <section className="testimonials-section" aria-labelledby="testimonials-title" onKeyDown={(event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      event.stopPropagation()
      move(event.key === 'ArrowLeft' ? 'previous' : 'next')
    }}>
      <div className="container testimonials-heading">
        <p>Depoimentos</p>
        <h2 id="testimonials-title">Quem fez recomenda</h2>
      </div>
      <Swiper id={id} className="testimonials-carousel" modules={[A11y]}
        slidesPerView="auto" spaceBetween={16} rewind
        tabIndex={0}
        a11y={{ containerMessage: 'Depoimentos de alunos', containerRoleDescriptionMessage: 'Carrossel',
          itemRoleDescriptionMessage: 'Depoimento', slideLabelMessage: '{{index}} de {{slidesLength}}' }}
        onSwiper={(instance) => { swiper.current = instance }}
        onSlideChange={(instance) => setIndex(instance.activeIndex)}>
        {testimonials.map(({ quote, name, role }) => (
          <SwiperSlide key={name}>
            <figure className="testimonial-card">
              <blockquote><p>“{quote}”</p></blockquote>
              <figcaption>
                <span className="testimonial-name">{name}</span>
                <span className="testimonial-role">{role}</span>
                <span className="testimonial-rating" role="img" aria-label="Avaliação: 5 de 5 estrelas">
                  {Array.from({ length: 5 }, (_, star) => (
                    <img key={star} src="/assets/star.svg" width="20" height="20" alt="" loading="lazy" />
                  ))}
                </span>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="container testimonials-footer">
        <span className="sr-only" role="status">Depoimento {index + 1} de {testimonials.length}</span>
        <div className="carousel-controls">
          <button type="button" className="carousel-arrow" aria-label="Depoimentos anteriores"
            aria-controls={id} onClick={() => move('previous')}>
            <ArrowLeft size={40} strokeWidth={1.6} aria-hidden="true" />
          </button>
          <button type="button" className="carousel-arrow" aria-label="Próximos depoimentos"
            aria-controls={id} onClick={() => move('next')}>
            <ArrowRight size={40} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
