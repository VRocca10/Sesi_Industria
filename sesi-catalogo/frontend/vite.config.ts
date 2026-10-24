import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  if (command === 'build' && process.env.VERCEL === '1') {
    const { VITE_API_BASE_URL } = loadEnv(mode, process.cwd(), 'VITE_')
    let apiUrl: URL
    try {
      apiUrl = new URL(VITE_API_BASE_URL ?? '')
    } catch {
      throw new Error('Configure VITE_API_BASE_URL na Vercel com a URL HTTPS pública da API, incluindo /api.')
    }
    if (apiUrl.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname)) {
      throw new Error('VITE_API_BASE_URL deve usar HTTPS e apontar para a API publicada, não localhost.')
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router-dom',
        'lucide-react',
        'swiper/react',
        'swiper/modules',
      ],
    },
  }
})
