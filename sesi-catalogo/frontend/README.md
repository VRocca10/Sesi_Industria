# Catálogo SESI + Indústria — front-end

Aplicação demonstrativa com seis cursos fictícios, baseada nas referências visuais fornecidas. Esta etapa usa dados locais; não há integração com API, banco ou Moodle.

## Execução

Requisitos: Node.js 22.12 ou superior e npm.

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

O build fica em `dist/`. A hospedagem precisa redirecionar rotas da aplicação para `index.html`. Publicação ainda não realizada nesta etapa.

## Tecnologias e organização

React, TypeScript, Vite, React Router, Swiper, Lucide e CSS. Axios está preparado para integração futura.

- `src/pages`: início, catálogo, detalhes e sala de aula.
- `src/components`: controles e cartões reutilizáveis.
- `src/sections`: seções das páginas.
- `src/data/courses.ts`: cursos fictícios, categorias, módulos e aulas.
- `src/types/course.ts`: modelo dos cursos.
- `src/services`: fonte local assíncrona e cliente HTTP reservado.
- `src/hooks`: carregamento, erro e nova tentativa.
- `src/utils/filterCourses.ts`: combinação da pesquisa e dos filtros.
- `tests`: testes da pesquisa e roteiro automatizado de navegador.

Os filtros de URL ficam em `useCourseFilters`. Os componentes do catálogo estão ao lado de `Courses.tsx`; os componentes da sala de aula e dos detalhes seguem a mesma organização. A normalização de pesquisa é compartilhada em `normalizeText` e o diálogo de vídeo é reutilizado pelas páginas. Consulte `CODE_REVIEW.md` para a revisão de estrutura e as verificações de preservação visual.

O modelo contém nome completo e breve, descrição, categoria, modalidade, carga horária, público-alvo, status, imagem, data opcional e módulos com aulas e descrições. Existem três categorias, duas modalidades e três status.

## Funcionalidades

O catálogo pesquisa nome completo e breve sem diferenciar acentos e maiúsculas, combina categoria, modalidade e status e apresenta a quantidade de resultados. Os filtros são preservados na URL e podem ser limpos. Há estados de carregamento, erro com nova tentativa e nenhum resultado.

Cada curso tem detalhes e sala de aula próprios. A matrícula nos detalhes só fica habilitada para status Disponível. Acesso direto à sala de aula de um curso Em breve ou Encerrado redireciona para seus detalhes; esta é uma regra demonstrativa no front-end, sem autenticação ou inscrição real. Filtros inválidos recebidos pela URL são descartados, preservando os demais parâmetros. A pesquisa de aulas preserva sua numeração original.

## Responsividade e acessibilidade

Os filtros ocupam quatro, duas ou uma coluna conforme a largura disponível. Cartões usam grade adaptável; o menu principal muda para menu móvel. A sala de aula adapta o menu lateral em telas pequenas.

Há rótulos de formulário, controles nativos, foco visível, link para pular ao conteúdo, contador anunciado por região de status, mensagens de erro e suporte a movimento reduzido. A rolagem reserva espaço para o cabeçalho e o foco na página de detalhes considera a barra de matrícula.

Verificados em Chromium: busca, combinações de filtros, URL após recarregar, limpar, estado vazio, carregamento, falha simulada e recuperação, navegação aos detalhes e às aulas, matrícula indisponível e ausência de rolagem horizontal no catálogo em 320, 375, 768, 1024 e 1440 px. O link de pular ao conteúdo também foi testado por teclado. Isso não substitui auditoria completa com leitor de tela e outros navegadores.

O teste opcional `tests/catalog.browser.cjs` requer uma instalação de `playwright-core` com Chromium disponível. Configure `PLAYWRIGHT_MODULE` com o caminho dessa instalação e `TEST_BASE_URL` com o endereço do Vite; depois execute `node tests/catalog.browser.cjs`. A falha local é simulada exclusivamente no teste, sem controles de depuração na interface.

## Limitações e diferenças visuais

- Ainda não há backend, endpoints, banco, publicação ou integração; ficam para outra etapa.
- Imagens disponíveis são reutilizadas e algumas não correspondem às fotografias específicas das referências.
- A busca e os filtros seguem tipografia, cores e componentes das referências; não foi fornecida uma tela específica para esses controles.
- O vídeo depende de `VITE_PRESENTATION_VIDEO_URL`; sem configuração, é apresentada uma mensagem de indisponibilidade.
- A sala de aula é demonstrativa, sem progresso real, autenticação ou integração Moodle.
- Algumas páginas institucionais e a área do aluno ainda apresentam mensagens de conteúdo futuro.
- O alinhamento visual completo com o arquivo Figma e a auditoria com leitor de tela permanecem pendentes.
