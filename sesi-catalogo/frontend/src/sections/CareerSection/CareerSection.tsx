import { useRef } from 'react'
import { ArrowRight, Play, X } from 'lucide-react'
import { Button } from '../../components/Button/Button'

export function CareerSection() {
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const videoUrl = import.meta.env.VITE_PRESENTATION_VIDEO_URL

  return (
    <section className="career-section" aria-labelledby="career-title">
      <div className="container career-inner">
        <div className="career-copy">
          <h2 id="career-title">Pronto para transformar sua carreira?</h2>
          <p>Junte-se a milhares de profissionais que já estão transformando a indústria através dos nossos cursos. Invista no seu futuro hoje mesmo!</p>
          <Button to="/cursos">Matricule-se <ArrowRight size={20} aria-hidden="true" /></Button>
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
      <dialog ref={dialog} className="career-dialog" aria-labelledby="career-video-title"
        onClose={() => video.current?.pause()}>
        <div className="career-dialog-heading">
          <h2 id="career-video-title">Conheça a capacitação SESI</h2>
          <button type="button" aria-label="Fechar vídeo" onClick={() => dialog.current?.close()}><X aria-hidden="true" /></button>
        </div>
        {videoUrl
          ? <video ref={video} src={videoUrl} controls playsInline preload="none" poster="/assets/video-thumb.webp" />
          : <p>Vídeo em breve. Enquanto isso, conheça os cursos disponíveis e encontre sua próxima oportunidade de aprendizado.</p>}
      </dialog>
    </section>
  )
}
