import { getCategories } from '../services/courseService'
import { useRemoteResource } from './useRemoteResource'

export function useCategories() {
  return useRemoteResource(getCategories)
}
