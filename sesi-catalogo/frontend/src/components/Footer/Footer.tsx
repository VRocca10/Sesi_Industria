import { Link } from 'react-router-dom'

const popularCourses = [
  'Cultura Organizacional',
  'Ferramentas Google para Produtividade',
  'Excel Básico ao Avançado',
  'Trabalho em Equipe e Colaboração',
  'Gestão do Tempo e Produtividade',
  'Comunicação Assertiva',
  'Inteligência Emocional no Trabalho',
]

const supportLinks = ['Termos de Uso', 'Política de Privacidade', 'Trabalhe Conosco', 'Fale Conosco', 'Central de Ajuda']
const socialNetworks = [
  { name: 'LinkedIn', icon: '/assets/icon-linkedIn-24px.svg' },
  { name: 'Instagram', icon: '/assets/icon-instagram-24px.svg' },
  { name: 'Facebook', icon: '/assets/icon-facebook-24px.svg' },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-columns">
          <div className="footer-contact">
            <Link to="/" className="footer-brand" aria-label="SESI + Indústria — início">
              <img src="/assets/logo-sesi-industria-white.svg" width="200" height="20" alt="" />
            </Link>
            <address>
              <a href="mailto:contato@sesindustria.com.br">contato@sesindustria.com.br</a>
              <span>Av. Paulista, 1313</span>
            </address>
          </div>
          <nav className="footer-column" aria-labelledby="footer-navigation-title">
            <h2 id="footer-navigation-title">Navegação</h2>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/#sobre">Certificação</Link></li>
              <li><Link to="/cursos">Cursos</Link></li>
              <li><Link to="/#sobre">Sobre</Link></li>
              <li><button type="button" disabled>Blog</button></li>
            </ul>
          </nav>
          <nav className="footer-column" aria-labelledby="footer-courses-title">
            <h2 id="footer-courses-title">Cursos populares</h2>
            <ul>{popularCourses.map((title) => <li key={title}><button type="button" disabled>{title}</button></li>)}</ul>
          </nav>
          <nav className="footer-column" aria-labelledby="footer-support-title">
            <h2 id="footer-support-title">Suporte</h2>
            <ul>{supportLinks.map((title) => (
              <li key={title}><button type="button" disabled>{title}</button></li>
            ))}</ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright"><img src="/assets/logo-sesi.svg" width="60" height="20" alt="SESI" /> <span>Todos os direitos reservados.</span></p>
          <div className="footer-socials" aria-label="Redes sociais">
            {socialNetworks.map(({ name, icon }) => (
              <button key={name} type="button" aria-label={name} disabled>
                <img src={icon} width="24" height="24" alt="" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
