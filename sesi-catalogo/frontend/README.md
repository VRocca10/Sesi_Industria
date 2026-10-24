# Catálogo SESI + Indústria — front-end

Aplicação demonstrativa com seis cursos fictícios, baseada nas referências visuais fornecidas. Catálogo, detalhes e aulas são carregados pela API .NET conectada ao PostgreSQL. Não há integração com Moodle.

## Execução

Requisitos: Node.js 22.12 ou superior e npm.

Inicie primeiro a API em `http://localhost:5000`, conforme `../backend/README.md`. O front usa `http://localhost:5000/api` por padrão. Para outro endereço, crie `.env.local` com `VITE_API_BASE_URL` e reinicie o Vite. O endereço da API é público; não coloque senhas ou tokens nessa variável.

```sh
npm ci
npm run dev
```

No PowerShell, use `npm.cmd` se a política de execução bloquear `npm.ps1`.

```sh
npm test
npm run build
npm run preview
```

O build fica em `dist/`. O arquivo `vercel.json` já configura o build e o redirecionamento das rotas para `index.html`. Na Vercel, configure `VITE_API_BASE_URL` com a URL HTTPS pública da API, incluindo `/api`; essa configuração é obrigatória no build da plataforma. Veja [o guia de publicação](../DEPLOY_VERCEL.md). Publicação ainda não realizada nesta etapa.

## Tecnologias e organização

React, TypeScript, Vite, React Router, Axios, Swiper, Lucide e CSS.

- `src/pages`: início, catálogo, detalhes e sala de aula.
- `src/components`: controles e cartões reutilizáveis.
- `src/sections`: seções das páginas.
- `tests/fixtures/courses.ts`: referência fictícia utilizada pelos testes; não é carregada pela aplicação.
- `src/types/course.ts`: modelo dos cursos.
- `src/services`: cliente HTTP e chamadas aos endpoints de cursos e categorias.
- `src/hooks`: requisições canceláveis, busca com debounce, carregamento, erro e nova tentativa.
- `src/utils/filterCourses.ts`: leitura e validação dos filtros da URL; a filtragem do catálogo é executada pela API.
- `src/utils/parseCourses.ts`: validação do contrato recebido antes de renderizar os dados.
- `tests`: testes da pesquisa e roteiro automatizado de navegador.

Os filtros de URL ficam em `useCourseFilters`. Os componentes do catálogo estão ao lado de `Courses.tsx`; os componentes da sala de aula e dos detalhes seguem a mesma organização. A normalização de pesquisa é compartilhada em `normalizeText` e o diálogo de vídeo é reutilizado pelas páginas. Consulte `CODE_REVIEW.md` para a revisão de estrutura e as verificações de preservação visual.

O modelo contém nome completo e breve, descrição, categoria, modalidade, carga horária, público-alvo, status, imagem, data opcional e módulos com aulas e descrições. Existem três categorias, duas modalidades e três status.

## Funcionalidades

O catálogo pesquisa nome completo e breve sem diferenciar acentos e maiúsculas, combina categoria, modalidade e status e apresenta a quantidade de resultados. Os filtros são preservados na URL e podem ser limpos. Há estados de carregamento, erro com nova tentativa e nenhum resultado.

O texto da pesquisa é enviado após 250 ms sem digitação; os demais filtros são enviados imediatamente. A contagem é obtida do campo `total` da API. As categorias são consultadas separadamente para manter todas as opções mesmo quando a busca não encontra cursos. A listagem segue a ordenação retornada pela API.

Ao mudar a pesquisa ou sair de uma tela, requisições anteriores são canceladas. Respostas antigas não podem sobrescrever o resultado atual. Não há fallback para os dados locais: falhas de rede, timeout ou contrato inválido exibem erro e opção de tentar novamente. Uma resposta 404 nos detalhes é tratada como curso não encontrado; falhas 500 não são confundidas com ausência do curso. Datas podem ser nulas.

Cada curso tem detalhes e sala de aula próprios. A matrícula nos detalhes só fica habilitada para status Disponível. Acesso direto à sala de aula de um curso Em breve ou Encerrado redireciona para seus detalhes; esta é uma regra demonstrativa no front-end, sem autenticação ou inscrição real. Filtros inválidos recebidos pela URL são descartados, preservando os demais parâmetros. A pesquisa de aulas preserva sua numeração original.

## Responsividade e acessibilidade

Os filtros ocupam quatro, duas ou uma coluna conforme a largura disponível. Cartões usam grade adaptável; o menu principal muda para menu móvel. A sala de aula adapta o menu lateral em telas pequenas.

Há rótulos de formulário, controles nativos, foco visível, link para pular ao conteúdo, contador anunciado por região de status, mensagens de erro e suporte a movimento reduzido. A rolagem reserva espaço para o cabeçalho e o foco na página de detalhes considera a barra de matrícula.

Verificados em Chromium: busca, combinações de filtros, URL após recarregar, limpar, estado vazio, carregamento, falha simulada e recuperação, navegação aos detalhes e às aulas, matrícula indisponível e ausência de rolagem horizontal no catálogo em 320, 375, 768, 1024 e 1440 px. O link de pular ao conteúdo também foi testado por teclado. Isso não substitui auditoria completa com leitor de tela e outros navegadores.

Os testes opcionais `tests/catalog.browser.cjs` e `tests/integration.browser.cjs` requerem uma instalação de `playwright-core` com Chromium disponível e a API/Vite em execução. Configure `PLAYWRIGHT_MODULE` com o caminho dessa instalação e `TEST_BASE_URL` com o endereço do Vite; depois execute os arquivos com Node. As falhas HTTP são simuladas exclusivamente nos testes, sem controles de depuração na interface. O segundo roteiro cobre categorias com resultado vazio, 404, recuperação de falhas de categorias e detalhes, contrato inválido, respostas fora de ordem e ausência de fallback local.

## Limitações e diferenças visuais

- Publicação e consolidação final dos entregáveis ainda estão pendentes.
- As fotos dos seis cursos foram substituídas por imagens relacionadas ao conteúdo de cada oferta, para melhorar a identificação dos cursos; elas diferem das referências originais.
- A busca e os filtros seguem tipografia, cores e componentes das referências; não foi fornecida uma tela específica para esses controles.
- O vídeo depende de `VITE_PRESENTATION_VIDEO_URL`; sem configuração, é apresentada uma mensagem de indisponibilidade.
- A sala de aula é demonstrativa, sem progresso real, autenticação ou integração Moodle.
- Algumas páginas institucionais e a área do aluno ainda apresentam mensagens de conteúdo futuro.
- O alinhamento visual completo com o arquivo Figma e a auditoria com leitor de tela permanecem pendentes.
