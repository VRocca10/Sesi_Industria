import { useCallback, useEffect } from 'react'
import { getCourse } from '../services/courseService'
import { useRemoteResource } from './useRemoteResource'

export function useCourse(id: string | undefined, titlePrefix = '') {
  const load = useCallback((signal: AbortSignal) => id ? getCourse(id, signal) : Promise.resolve(null), [id])
  const resource = useRemoteResource(load)

  useEffect(() => {
    if (resource.state.status === 'success') {
      document.title = resource.state.data
        ? `${titlePrefix}${resource.state.data.shortName} | SESI + Indústria`
        : 'Curso não encontrado | SESI + Indústria'
    }
  }, [resource.state, titlePrefix])

  return resource
}
