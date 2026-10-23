import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '../Button/Button'

export function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 16)
  const menuButton = useRef<HTMLButtonElement>(null)
  const studentDialog = useRef<HTMLDialogElement>(null)
  const transparent = pathname === '/' && !scrolled && !menuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <header className={`site-header ${transparent ? 'site-header--transparent' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="SESI + Indústria — início" onClick={closeMenu}>
            <img src={`/assets/logo-sesi-industria-${transparent ? 'white' : 'primary'}.svg`} width="188" height="19" alt="" />
          </Link>
          <button ref={menuButton} type="button" className="menu-toggle" aria-expanded={menuOpen}
            aria-controls="main-navigation" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="main-navigation" aria-label="Navegação principal" className={`main-navigation ${menuOpen ? 'is-open' : ''}`}>
            <Link to="/" aria-current={pathname === '/' ? 'page' : undefined} onClick={closeMenu}>Início</Link>
            <Link to="/cursos" aria-current={pathname === '/cursos' ? 'page' : undefined} onClick={closeMenu}>Cursos</Link>
            <Link to="/#sobre" onClick={closeMenu}>Sobre</Link>
            <Button variant="outline" onClick={() => { closeMenu(); studentDialog.current?.showModal() }}>Área do aluno</Button>
          </nav>
        </div>
      </header>
      <dialog ref={studentDialog} className="information-dialog" aria-labelledby="student-dialog-title">
        <h2 id="student-dialog-title">Área do aluno</h2>
        <p>Este é um projeto demonstrativo. O acesso ao ambiente de aprendizagem e a autenticação não fazem parte desta etapa.</p>
        <form method="dialog"><Button type="submit" variant="outline">Fechar</Button></form>
      </dialog>
    </>
  )
}
