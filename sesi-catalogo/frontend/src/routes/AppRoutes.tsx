import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { Home } from '../pages/Home/Home'
import { Courses } from '../pages/Courses/Courses'
import { CourseDetails } from '../pages/CourseDetails/CourseDetails'
import { Learning } from '../pages/Learning/Learning'
import { Button } from '../components/Button/Button'

export function AppRoutes() {
  const { pathname, hash } = useLocation()
  const learning = pathname.startsWith('/aprender/')
  useEffect(() => {
    document.title = pathname === '/' ? 'SESI + Indústria | Cursos para sua carreira'
      : pathname === '/cursos' ? 'Catálogo de cursos | SESI + Indústria'
      : learning ? 'Sala de aula | SESI + Indústria'
      : pathname.startsWith('/cursos/') ? 'Curso | SESI + Indústria'
      : 'Página não encontrada | SESI + Indústria'
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
      else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document.getElementById('conteudo')?.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, learning])

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      {!learning && <Header />}
      <main id="conteudo" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/cursos/:courseId" element={<CourseDetails />} />
          <Route path="/aprender/:courseId" element={<Learning />} />
          <Route path="*" element={
            <section className="container placeholder-page">
              <h1>Página não encontrada</h1>
              <p>O endereço acessado não existe nesta aplicação.</p>
              <Button to="/" variant="outline">Voltar ao início</Button>
            </section>
          } />
        </Routes>
      </main>
      {!learning && <Footer />}
    </>
  )
}
