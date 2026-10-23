import axios from 'axios'

// Preparado para a etapa de integração; ainda não utilizado pelo serviço local.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  timeout: 10_000,
})
