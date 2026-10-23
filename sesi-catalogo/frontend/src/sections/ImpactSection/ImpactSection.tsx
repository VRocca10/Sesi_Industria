const indicators = [
  { value: '25.000+', label: 'Profissionais Capacitados' },
  { value: '500+', label: 'Empresas parceiras' },
  { value: '4.8/5', label: 'Avaliação média' },
  { value: '2.5M+', label: 'Horas de capacitação' },
]

const benefits = [
  { title: 'Certificação SESI', icon: '/assets/01-certificacao-red.svg' },
  { title: 'Professores especialistas', icon: '/assets/02-professores-red.svg' },
  { title: 'Suporte contínuo', icon: '/assets/03-suporte-red.svg' },
]

export function ImpactSection() {
  return (
    <section id="sobre" className="impact-section container" aria-labelledby="impact-title">
      <div className="impact-intro">
        <h2 id="impact-title">Impacto transformador</h2>
        <p>Resultados que demonstram o sucesso da nossa metodologia de capacitação contínua para a indústria</p>
      </div>
      <div className="impact-results">
        <dl className="impact-indicators">
          {indicators.map(({ value, label }) => (
            <div className="impact-indicator" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <ul className="impact-benefits" aria-label="Diferenciais da capacitação">
          {benefits.map(({ title, icon }) => (
            <li key={title}>
              <img src={icon} width="52" height="52" alt="" loading="lazy" />
              <h3>{title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
