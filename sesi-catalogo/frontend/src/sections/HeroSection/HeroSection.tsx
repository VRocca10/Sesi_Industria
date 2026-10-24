import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/Button/Button'

export function HeroSection() {
  const scrollFrame = useRef<number | null>(null)
  useEffect(() => () => {
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current)
  }, [])

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title">Impulsione<br className="desktop-break" /> sua carreira<br className="desktop-break" /> na indústria</h1>
          <p>Amplie seus conhecimentos com excelência na melhor plataforma de estudos da indústria brasileira</p>
          <Button to="/#cursos" onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            const courses = document.getElementById('cursos')
            if (!courses) return
            event.preventDefault()
            if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current)
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              courses.scrollIntoView({ behavior: 'instant', block: 'start' })
              return
            }
            const start = window.scrollY
            const offset = parseFloat(getComputedStyle(courses).scrollMarginTop) || 0
            const target = Math.max(0, Math.min(
              start + courses.getBoundingClientRect().top - offset,
              document.documentElement.scrollHeight - window.innerHeight,
            ))
            const startedAt = performance.now()
            function animateScroll(now: number) {
              const progress = Math.min((now - startedAt) / 1200, 1)
              const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10)
              window.scrollTo({ top: start + (target - start) * eased, behavior: 'instant' })
              scrollFrame.current = progress < 1 ? requestAnimationFrame(animateScroll) : null
            }
            scrollFrame.current = requestAnimationFrame(animateScroll)
          }}>Conhecer cursos <ArrowRight size={22} aria-hidden="true" /></Button>
        </div>
      </div>
    </section>
  )
}
