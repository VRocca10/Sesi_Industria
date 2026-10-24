import { useEffect, useState } from 'react'
import { getCourses } from '../services/courseService'
import type { Course } from '../types/course'

export type CourseState =
  | { status: 'loading' }
  | { status: 'success'; courses: readonly Course[] }
  | { status: 'error' }

export function useCourses() {
  const [state, setState] = useState<CourseState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    void getCourses().then(
      (courses) => { if (active) setState({ status: 'success', courses }) },
      () => { if (active) setState({ status: 'error' }) },
    )
    return () => { active = false }
  }, [attempt])

  function retry() {
    setState({ status: 'loading' })
    setAttempt((value) => value + 1)
  }

  return { state, retry }
}
