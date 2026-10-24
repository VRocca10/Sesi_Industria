const benefits = [
  { icon: '01-certificacao-bege.svg', title: 'Certificação SESI', description: 'Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI.' },
  { icon: '02-professores-bege.svg', title: 'Professores especialistas', description: 'Contamos com professores reconhecidos por sua excelência no mercado.' },
  { icon: '03-suporte-bege.svg', title: 'Suporte contínuo', description: 'Você não está sozinho! Acompanhamento online durante todo o curso.' },
  { icon: '04-flexibilidade-bege.svg', title: 'Flexibilidade', description: 'Turmas presenciais e online com horários que se adaptam à sua rotina.' },
]

export function CourseBenefits() {
  return (
    <section className="container course-details-benefits" aria-label="Benefícios do curso">
      {benefits.map((benefit) => <article key={benefit.title}>
        <img src={`/assets/${benefit.icon}`} width="50" height="50" alt="" />
        <h2>{benefit.title}</h2><p>{benefit.description}</p>
      </article>)}
    </section>
  )
}
