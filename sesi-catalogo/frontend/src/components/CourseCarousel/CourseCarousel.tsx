import { useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import type { Course } from '../../types/course'
import { Button } from '../Button/Button'
import { CourseCard } from '../CourseCard/CourseCard'
import 'swiper/css'

export function CourseCarousel({ courses }: { courses: readonly Course[] }) {
  const id = useId()
  const swiper = useRef<SwiperInstance | null>(null)
  const [position, setPosition] = useState({ beginning: true, end: courses.length <= 1, index: 0 })
  function updatePosition(instance: SwiperInstance) {
    setPosition({ beginning: instance.isBeginning, end: instance.isEnd, index: instance.activeIndex })
  }
  function move(direction: 'previous' | 'next') {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const speed = reducedMotion ? 0 : 350
    if (direction === 'previous') swiper.current?.slidePrev(speed)
    else swiper.current?.slideNext(speed)
  }

  return (
    <div className="course-carousel" onKeyDown={(event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      event.stopPropagation()
      move(event.key === 'ArrowLeft' ? 'previous' : 'next')
    }}>
      <Swiper id={id} modules={[A11y]} slidesPerView="auto" spaceBetween={16}
        tabIndex={0}
        a11y={{
          enabled: true, containerRoleDescriptionMessage: 'Carrossel',
          containerMessage: 'Principais cursos', itemRoleDescriptionMessage: 'Curso',
          slideLabelMessage: '{{index}} de {{slidesLength}}',
        }}
        onSwiper={(instance) => { swiper.current = instance; updatePosition(instance) }}
        onSlideChange={updatePosition} onResize={updatePosition}>
        {courses.map((course) => (
          <SwiperSlide key={course.id}><CourseCard course={course} /></SwiperSlide>
        ))}
      </Swiper>
      <div className="carousel-footer container">
        <Button to="/cursos" variant="outline">Ver todos os cursos</Button>
        <div className="carousel-controls">
          <span className="sr-only" role="status">Curso {position.index + 1} de {courses.length}</span>
          <button type="button" className="carousel-arrow" aria-label="Cursos anteriores" aria-controls={id}
            disabled={position.beginning} onClick={() => move('previous')}>
            <ArrowLeft size={40} strokeWidth={1.6} aria-hidden="true" />
          </button>
          <button type="button" className="carousel-arrow" aria-label="Próximos cursos" aria-controls={id}
            disabled={position.end} onClick={() => move('next')}>
            <ArrowRight size={40} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
