import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/Button/Button'

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title">Impulsione<br className="desktop-break" /> sua carreira<br className="desktop-break" /> na indústria</h1>
          <p>Amplie seus conhecimentos com excelência na melhor plataforma de estudos da indústria brasileira</p>
          <Button to="/#cursos">Conhecer cursos <ArrowRight size={22} aria-hidden="true" /></Button>
        </div>
      </div>
    </section>
  )
}
