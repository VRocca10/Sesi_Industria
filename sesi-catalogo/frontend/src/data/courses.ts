import type { Course, CourseCategory } from '../types/course'

const mathematics: CourseCategory = {
  id: 'matematica', name: 'Matemática', icon: '/assets/icon-matematica-20px.svg',
}
const science: CourseCategory = {
  id: 'ciencias-natureza', name: 'Ciências da natureza', icon: '/assets/icon-ciencias-natureza-20px.svg',
}
const languages: CourseCategory = {
  id: 'linguagens', name: 'Linguagens', icon: '/assets/icon-linguagens-20px.svg',
}

export const courses: Course[] = [
  {
    id: 'matematica-precisao',
    fullName: 'Matemática para a Precisão: Medidas e Escalas na Metalurgia',
    shortName: 'Matemática para a Precisão',
    description: 'Aplicação de grandezas, proporções e escalas em processos de corte, furação e usinagem.',
    category: mathematics, modality: 'A distância', workloadHours: 20,
    targetAudience: 'Operadores de máquinas e estudantes da área de metalurgia.',
    status: 'Disponível', image: '/assets/banner-ava.webp', availableFrom: '2026-01-15',
    modules: [
      { id: 'medidas', name: 'Grandezas e medidas', lessons: [
        { id: 'unidades', name: 'Unidades de medida', description: 'Conversões entre milímetros, centímetros e metros aplicadas a peças industriais.' },
        { id: 'paquimetro', name: 'Leitura de instrumentos', description: 'Interpretação de medidas e tolerâncias em exercícios com paquímetro.' },
      ] },
      { id: 'escalas', name: 'Proporções e escalas', lessons: [
        { id: 'desenho', name: 'Escalas no desenho técnico', description: 'Cálculo das dimensões de peças a partir de representações em escala.' },
      ] },
    ],
  },
  {
    id: 'geometria-textil', fullName: 'Geometria e Modelagem no Design Têxtil',
    shortName: 'Geometria e Modelagem',
    description: 'Explora formas geométricas, simetria e padrões matemáticos presentes em tecidos e estampas.',
    category: mathematics, modality: 'Semipresencial', workloadHours: 32,
    targetAudience: 'Profissionais de confecção, modelistas e estudantes de design.',
    status: 'Disponível', image: '/assets/hero-image-960.webp', availableFrom: '2026-02-02',
    modules: [
      { id: 'formas', name: 'Geometria no tecido', lessons: [
        { id: 'simetria', name: 'Simetria e padrões', description: 'Identificação de translações, rotações e reflexões em estampas.' },
      ] },
      { id: 'modelagem', name: 'Modelagem e aproveitamento', lessons: [
        { id: 'areas', name: 'Áreas de moldes', description: 'Cálculo de áreas e planejamento do corte para reduzir desperdícios.' },
        { id: 'proporcoes', name: 'Ampliação proporcional', description: 'Adaptação das medidas de um molde preservando as proporções.' },
      ] },
    ],
  },
  {
    id: 'estatistica-qualidade', fullName: 'Estatística e Controle de Qualidade na Produção',
    shortName: 'Estatística na Produção',
    description: 'Leitura e interpretação de dados de controle de qualidade e produtividade.',
    category: mathematics, modality: 'A distância', workloadHours: 24,
    targetAudience: 'Assistentes de qualidade e líderes de linhas de produção.',
    status: 'Em breve', image: '/assets/video-thumb-960.webp', availableFrom: '2027-02-10',
    modules: [
      { id: 'dados', name: 'Dados da produção', lessons: [
        { id: 'amostras', name: 'Amostragem industrial', description: 'Organização de amostras e construção de tabelas de frequência.' },
        { id: 'medias', name: 'Média e dispersão', description: 'Interpretação de indicadores para comparar lotes de produção.' },
      ] },
      { id: 'controle', name: 'Controle de processos', lessons: [
        { id: 'graficos', name: 'Gráficos de controle', description: 'Leitura de tendências e identificação de variações em processos fictícios.' },
      ] },
    ],
  },
  {
    id: 'fisica-metalurgia', fullName: 'Física do Movimento e da Energia na Metalurgia',
    shortName: 'Física na Metalurgia',
    description: 'Estudo de forças, atrito, calor e energia em máquinas, fornos e prensas.',
    category: science, modality: 'Semipresencial', workloadHours: 40,
    targetAudience: 'Técnicos de manutenção e estudantes de processos metalúrgicos.',
    status: 'Disponível', image: '/assets/video-thumb-960.webp', availableFrom: '2026-03-12',
    modules: [
      { id: 'movimento', name: 'Forças em máquinas', lessons: [
        { id: 'atrito', name: 'Movimento e atrito', description: 'Relação entre forças e deslocamento de componentes de uma máquina.' },
      ] },
      { id: 'energia', name: 'Energia e transformação', lessons: [
        { id: 'calor', name: 'Transferência de calor', description: 'Condução, convecção e radiação em exemplos de fornos industriais.' },
        { id: 'eficiencia', name: 'Eficiência energética', description: 'Comparação entre energia utilizada e trabalho realizado em prensas.' },
      ] },
    ],
  },
  {
    id: 'quimica-sustentabilidade', fullName: 'Química e Sustentabilidade nos Processos Industriais',
    shortName: 'Química e Sustentabilidade',
    description: 'Estudo das transformações químicas e do uso consciente de recursos na indústria.',
    category: science, modality: 'A distância', workloadHours: 16,
    targetAudience: 'Auxiliares de laboratório e profissionais interessados em sustentabilidade.',
    status: 'Encerrado', image: '/assets/banner-ava.webp',
    modules: [
      { id: 'materiais', name: 'Materiais e reações', lessons: [
        { id: 'transformacoes', name: 'Transformações químicas', description: 'Reconhecimento de reações e propriedades dos materiais em processos simulados.' },
      ] },
      { id: 'recursos', name: 'Uso responsável de recursos', lessons: [
        { id: 'residuos', name: 'Gestão de resíduos', description: 'Classificação de resíduos em uma atividade fictícia e propostas de reaproveitamento.' },
      ] },
    ],
  },
  {
    id: 'comunicacao-industria', fullName: 'Comunicação e Leitura Técnica na Indústria',
    shortName: 'Comunicação na Indústria',
    description: 'Leitura de instruções, elaboração de registros e comunicação clara no ambiente de trabalho.',
    category: languages, modality: 'A distância', workloadHours: 12,
    targetAudience: 'Aprendizes e profissionais em início de carreira na indústria.',
    status: 'Em breve', image: '/assets/hero-image-960.webp', availableFrom: '2027-03-01',
    modules: [
      { id: 'leitura', name: 'Leitura técnica', lessons: [
        { id: 'instrucoes', name: 'Instruções de trabalho', description: 'Identificação de informações essenciais em manuais e procedimentos fictícios.' },
      ] },
      { id: 'comunicacao', name: 'Comunicação profissional', lessons: [
        { id: 'registros', name: 'Registros de ocorrência', description: 'Produção de mensagens objetivas para comunicar situações da rotina industrial.' },
        { id: 'equipe', name: 'Diálogo em equipe', description: 'Organização de informações para uma passagem de turno clara e respeitosa.' },
      ] },
    ],
  },
]
