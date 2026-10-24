import { Button } from '../Button/Button'
import type { RemoteState } from '../../hooks/useRemoteResource'
import type { Course } from '../../types/course'

interface Props { state: RemoteState<Course | null>; onRetry: () => void; variant?: 'light' | 'outline' }

export function CourseLoadState({ state, onRetry, variant = 'light' }: Props) {
  return <section className="container placeholder-page" aria-busy={state.status === 'loading'}>
    {state.status === 'loading' ? <p role="status">Carregando curso…</p>
      : state.status === 'error' ? <div role="alert"><h1>Não foi possível carregar o curso</h1><p>Verifique sua conexão e tente novamente.</p><Button variant="outline" onClick={onRetry}>Tentar novamente</Button></div>
      : <><h1>Curso não encontrado</h1><Button to="/cursos" variant={variant}>Ver cursos</Button></>}
  </section>
}
