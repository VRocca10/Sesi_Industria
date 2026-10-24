import { useRef } from 'react'
import type { RefObject } from 'react'
import { X } from 'lucide-react'

interface Props {
  dialogRef: RefObject<HTMLDialogElement | null>
  titleId: string
  title: string
  unavailableMessage: string
}

export function VideoDialog({ dialogRef, titleId, title, unavailableMessage }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const videoUrl = import.meta.env.VITE_PRESENTATION_VIDEO_URL

  return <dialog ref={dialogRef} className="career-dialog" aria-labelledby={titleId} onClose={() => video.current?.pause()}>
    <div className="career-dialog-heading">
      <h2 id={titleId}>{title}</h2>
      <button type="button" aria-label="Fechar vídeo" onClick={() => dialogRef.current?.close()}><X aria-hidden="true" /></button>
    </div>
    {videoUrl
      ? <video ref={video} src={videoUrl} controls playsInline preload="none" poster="/assets/video-thumb.webp" />
      : <p>{unavailableMessage}</p>}
  </dialog>
}
