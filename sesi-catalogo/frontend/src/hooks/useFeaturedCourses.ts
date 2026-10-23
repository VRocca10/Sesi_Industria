import { useEffect, useState } from 'react'
import { getFeaturedCourses } from '../services/courseService'
import type { Course } from '../types/course'

type CourseState =
  | { status: 'loading' }
  | { status: 'success'; courses: readonly Course[] }
  | { status: 'error' }

export function useFeaturedCourses() {
  const [state, setState] = useState<CourseState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    void getFeaturedCourses().then(
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
