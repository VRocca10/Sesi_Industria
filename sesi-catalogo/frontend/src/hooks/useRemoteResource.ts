import { useCallback, useEffect, useState } from 'react'

export type RemoteState<T> = { status: 'loading' } | { status: 'success'; data: T } | { status: 'error' }

export function useRemoteResource<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [snapshot, setSnapshot] = useState<{ source: typeof load; state: RemoteState<T> }>(() => ({ source: load, state: { status: 'loading' } }))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setSnapshot({ source: load, state: { status: 'loading' } })
    void load(controller.signal).then(
      (data) => { if (!controller.signal.aborted) setSnapshot({ source: load, state: { status: 'success', data } }) },
      () => { if (!controller.signal.aborted) setSnapshot({ source: load, state: { status: 'error' } }) },
    )
    return () => controller.abort()
  }, [load, attempt])

  const retry = useCallback(() => {
    setSnapshot({ source: load, state: { status: 'loading' } })
    setAttempt((value) => value + 1)
  }, [load])

  const state: RemoteState<T> = snapshot.source === load ? snapshot.state : { status: 'loading' }
  return { state, retry }
}
