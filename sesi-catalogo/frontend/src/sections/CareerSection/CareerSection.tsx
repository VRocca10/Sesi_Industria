import { useRef } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { VideoDialog } from '../../components/VideoDialog/VideoDialog'

export function CareerSection() {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <section className="career-section" aria-labelledby="career-title">
      <div className="container career-inner">
        <div className="career-copy">
          <h2 id="career-title">Pronto para transformar sua carreira?</h2>
          <p>Junte-se a milhares de profissionais que já estão transformando a indústria através dos nossos cursos. Invista no seu futuro hoje mesmo!</p>
          <Button to="/cursos/matematica-precisao">Matricule-se <ArrowRight size={20} aria-hidden="true" /></Button>
        </div>
        <button type="button" className="career-video" aria-label="Reproduzir vídeo de apresentação"
          aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
          <img src="/assets/video-thumb.webp"
            srcSet="/assets/video-thumb-640.webp 640w, /assets/video-thumb-960.webp 960w, /assets/video-thumb.webp 1280w"
            sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1024px) 50vw, (max-width: 1448px) calc(84vw - 428px), 788px"
            width="784" height="441" alt="Profissionais trabalhando em uma máquina industrial" loading="lazy" />
          <span className="career-play"><Play size={36} fill="currentColor" strokeWidth={0} aria-hidden="true" /></span>
        </button>
      </div>
      <VideoDialog dialogRef={dialog} titleId="career-video-title" title="Conheça a capacitação SESI" unavailableMessage="Vídeo em breve. Enquanto isso, conheça os cursos disponíveis e encontre sua próxima oportunidade de aprendizado." />
    </section>
  )
}
