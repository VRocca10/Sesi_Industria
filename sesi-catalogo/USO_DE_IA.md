# Uso de Inteligência Artificial

Este documento registra o uso de IA no frontend, no backend e na preparação da publicação do Catálogo SESI + Indústria. Os registros de etapas anteriores são históricos; atualmente, o frontend consulta a API .NET conectada ao PostgreSQL.

## 1. Ferramenta utilizada

Codex, da OpenAI.

## 2. Objetivo do uso

Auxiliar na implementação e revisão do frontend React/TypeScript e do backend C#/.NET, adaptar os layouts às referências fornecidas, integrar a API ao PostgreSQL, preparar configurações de publicação e verificar requisitos do desafio. Todos os dados educacionais do catálogo são fictícios.

## 3. Prompts relevantes: conteúdo aproveitado ou descartado

Os prompts abaixo são trechos das solicitações registradas durante o desenvolvimento. A indicação de descarte também abrange soluções de etapas anteriores que foram substituídas.

| Prompt ou contexto | Aproveitado | Descartado ou substituído |
| --- | --- | --- |
| “Cada matéria ter sua tela respectiva” | Rotas e conteúdo parametrizados por curso. | Conteúdo único compartilhado entre cursos com informações diferentes. |
| “Falando nos requisitos exclusivos do front, o que preciso fazer e o que está pronto” | Revisão das lacunas de pesquisa, filtros, contagem e estados do catálogo. | A implementação inicial sem esses recursos foi complementada. |
| “Faça o que ainda falta, por favor” | Pesquisa, filtros combinados, limpeza e estados visuais. | A fonte local de cursos, usada naquela etapa, foi substituída pela API na integração posterior. |
| “Faça um code review [...] apenas performance e estrutura [...] não modifique nada de layout ou tela” | Separação de componentes e hooks e redução de processamento duplicado. | Mudanças de layout e CSS ficaram fora do escopo dessa revisão. |
| “agora vamos começar a integração” | Axios, endpoints existentes, cancelamento, debounce e validação do contrato. | Importação dos dados locais pela aplicação e uso desses dados como fallback. |
| “agora prepare meu codigo para ser versionado na vercel” | Configuração de build, rotas e guia de publicação. | Uso do endereço localhost como API do site publicado. |

### Histórico e decisões por etapa

- “Cada matéria ter sua tela respectiva”: aproveitada a parametrização das rotas e do conteúdo com os dados de cada curso.
- “Falando nos requisitos exclusivos do front, o que preciso fazer e o que está pronto”: aproveitada a revisão que identificou ausência de pesquisa, filtros combináveis, contagem e estados de catálogo.
- “Faça o que ainda falta, por favor”: implementados pesquisa, filtros, limpeza, resultados, estados visuais e apresentação das informações, mantendo a fonte local conforme solicitado.
- As imagens fornecidas orientaram espaçamento, cores, tipografia e navegação. Fotografias ausentes não foram substituídas por novas imagens geradas; foram reutilizados os recursos locais e essa diferença foi registrada.
- A integração com backend foi adiada por instrução do usuário, em vez de ser incluída nesta etapa.
- “Faça um code review [...] apenas performance e estrutura [...] não modifique nada de layout ou tela”: aproveitada a separação de componentes e hooks e a eliminação de processamento duplicado. Não foram introduzidas dependências ou alterações de CSS. Foram comparadas oito capturas de telas antes e depois da refatoração, sem diferenças.

## 4. Como o conteúdo foi validado

As verificações abaixo foram registradas durante as respectivas etapas de implementação. Esta organização documental não representa uma nova execução dos testes.

Na etapa inicial do backend, o Codex também foi utilizado para criar os modelos C#, o contexto e as configurações do EF Core e a migration inicial. Foram verificados compilação, aplicação ao PostgreSQL local, ausência de mudanças pendentes no modelo e repetição da atualização sem reaplicar a migration. A conexão usa User Secrets, sem registrar senha no código.

Na carga inicial, foi aproveitada a transformação dos dados fictícios do front-end em um recurso JSON incorporado ao backend. A inserção utiliza as rotinas síncrona e assíncrona de seeding do EF Core, preservando chaves e ordenação. O verificador local confirmou três categorias, seis cursos, doze módulos e dezessete aulas, comparou todos os campos e repetiu as duas rotinas sem duplicação ou alteração dos registros. Foi identificado um conflito de versões transitivas do Entity Framework no projeto de verificação; as referências de runtime e design foram alinhadas e fixadas antes de repetir os testes com sucesso.

Na etapa dos endpoints, o Codex criou DTOs, serviço de consulta e controllers para listar cursos, consultar detalhes e listar categorias. Foram utilizadas as documentações oficiais do PostgreSQL e do Npgsql para a busca com `unaccent` e `ILIKE`. Foram executados 34 testes HTTP contra o banco local, cobrindo dados completos, pesquisa, filtros, retorno vazio, validações, 404 e indisponibilidade de operações de escrita. A resposta 500 foi verificada em uma instância temporária com conexão inválida, confirmando ausência de detalhes da exceção no corpo da resposta. O front permaneceu sem integração nesta etapa.

Na etapa seguinte, o prompt “agora vamos começar a integração” orientou a conexão do front à API via Axios. Foram aproveitados os endpoints existentes para listagem, filtros, categorias, detalhes e aulas. Foram implementados cancelamento, debounce, validação do contrato, estados de erro e política CORS com origens explícitas. Os dados locais deixaram de ser importados pela aplicação. A validação incluiu 15 testes unitários do front, 36 testes HTTP e dois roteiros de navegador com API e PostgreSQL reais. Um roteiro também simulou respostas fora de ordem para verificar que uma busca antiga não substitui a atual. O layout e os arquivos CSS foram preservados.

- Compilação TypeScript e build Vite.
- Sete testes automatizados da pesquisa e dos filtros, incluindo acentos, nome breve, combinação de critérios e resultados vazios.
- Testes em Chromium de busca, seleção de filtros, persistência na URL, limpeza, navegação e disponibilidade de matrícula.
- Carregamento, erro e nova tentativa verificados com falha simulada pelo teste de navegador.
- Verificação de ausência de overflow horizontal do catálogo em cinco larguras, além do link de pular ao conteúdo por teclado.
- Inspeção de captura do catálogo. A auditoria completa com leitor de tela e a comparação integral com Figma não foram realizadas.

## 5. Exemplo de erro ou inadequação identificado

A primeira implementação permitia que cursos “Em breve” e “Encerrado” exibissem o mesmo botão de matrícula dos cursos disponíveis. O status não era mostrado no catálogo.

## 6. Correção realizada

O status passou a aparecer nos cartões do catálogo e nos detalhes. Os dois controles de matrícula nos detalhes ficam desabilitados com mensagem correspondente para ofertas indisponíveis. O teste de navegador verifica esse comportamento para um curso de cada status indisponível.

O código gerado por IA foi ajustado durante a implementação e não foi considerado validado apenas por ter sido gerado.

## Preparação para Vercel

Prompt: “agora prepare meu codigo para ser versionado na vercel”. Codex foi utilizado para configurar o build Vite, o redirecionamento das rotas do React Router e o guia de publicação com API .NET externa. Foi identificado que o padrão local da API não funcionaria para visitantes do site publicado. A correção foi validar `VITE_API_BASE_URL` no build da Vercel, exigindo uma URL pública HTTPS. A configuração foi validada por compilação, testes existentes e simulações de build com variáveis ausentes, locais e públicas. O deploy real depende das contas, da API hospedada e dos endereços definitivos.

Na orientação sobre publicação da API, foram adicionados Dockerfile multiestágio .NET 10 e .dockerignore para o Render, com execução sem root na porta 8080. O publish Release foi validado; a imagem Docker e a publicação remota ainda não foram executadas.
