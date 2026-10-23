import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { Home } from '../pages/Home/Home'
import { Courses } from '../pages/Courses/Courses'
import { Button } from '../components/Button/Button'

export function AppRoutes() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    document.title = pathname === '/' ? 'SESI + Indústria | Cursos para sua carreira'
      : pathname === '/cursos' ? 'Catálogo de cursos | SESI + Indústria'
      : 'Página não encontrada | SESI + Indústria'
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
      else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document.getElementById('conteudo')?.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key])

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="*" element={
            <section className="container placeholder-page">
              <h1>Página não encontrada</h1>
              <p>O endereço acessado não existe nesta aplicação.</p>
              <Button to="/" variant="outline">Voltar ao início</Button>
            </section>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
