# Catálogo SESI + Indústria

## Objetivo da aplicação

Aplicação desenvolvida para o desafio técnico do processo seletivo de Desenvolvedor de Sistemas I. A solução oferece um catálogo de seis cursos fictícios, com pesquisa, filtros combinados, informações detalhadas e navegação por uma sala de aula demonstrativa.

| Serviço | Endereço |
| --- | --- |
| Aplicação web — Vercel | [Catálogo SESI + Indústria](https://sesi-industria-frontend.vercel.app/) |
| API — Render | [API do catálogo](https://sesi-catalogo-api-64xg.onrender.com/api/categories) |

A base dos endpoints é `https://sesi-catalogo-api-64xg.onrender.com/api`. O escopo contempla a consulta de cursos e a demonstração do ambiente de aprendizagem.

## Documentação da entrega

- [Uso de Inteligência Artificial](USO_DE_IA.md): ferramenta utilizada, objetivos, prompts, conteúdo aproveitado ou descartado, validação e exemplo de erro com a correção realizada.
- [Frontend](frontend/README.md): organização, funcionalidades e verificações da interface.
- [Backend](backend/README.md): banco de dados, carga inicial, endpoints e configuração da API.
- [Publicação](DEPLOY_VERCEL.md): configuração do frontend, da API externa e das variáveis de ambiente.
- [Revisão de código](frontend/CODE_REVIEW.md): ajustes de estrutura e verificações registradas.

## Funcionalidades

- Consulta de seis cursos fictícios, com pesquisa sem distinção entre acentos, letras maiúsculas e minúsculas.
- Filtros combinados por categoria, modalidade e status, contagem de resultados e filtros preservados na URL.
- Detalhes de cada curso, módulos, aulas e sala de aula demonstrativa.
- Bloqueio dos controles de matrícula para cursos com status “Em breve” ou “Encerrado”.
- Tratamento de carregamento, ausência de resultados, curso não encontrado e falhas de comunicação, com opção de nova tentativa.

## Tecnologias utilizadas

- Frontend: React, TypeScript, Vite, React Router, Axios, Swiper, Lucide e CSS.
- Backend: C#, ASP.NET Core 10 e Entity Framework Core 10.
- Banco de dados: PostgreSQL, provedor Npgsql e extensão `unaccent`.
- Verificação: testes unitários, testes HTTP com Node.js e roteiros de navegador com Playwright/Chromium.

## Arquitetura da solução

O fluxo de dados é `React → API ASP.NET Core → PostgreSQL`.

O frontend apresenta as telas e consulta a API por HTTP usando Axios. A API organiza as rotas em controllers, retorna DTOs e utiliza serviços de consulta para acessar o banco por meio do Entity Framework Core e do Npgsql. O PostgreSQL armazena categorias, cursos, módulos e aulas; as migrations mantêm o esquema e executam a carga inicial fictícia.

Os filtros do catálogo são processados pela API. O frontend trata carregamento, erros e cancelamento de requisições, sem recorrer aos dados locais de teste em caso de falha. Frontend e API são executados e publicados como serviços separados.

## Estrutura das pastas

Os caminhos abaixo são relativos à pasta `sesi-catalogo`.

| Caminho | Responsabilidade |
| --- | --- |
| `frontend/src` | Páginas, componentes, hooks, serviços HTTP, tipos e estilos da interface. |
| `frontend/public` | Recursos estáticos utilizados pela aplicação. |
| `frontend/tests` | Testes unitários, dados de teste e roteiros de navegador. |
| `backend/Sesi.Catalogo.Api` | Projeto da API ASP.NET Core. |
| `backend/Sesi.Catalogo.Api/Controllers` | Rotas HTTP da API. |
| `backend/Sesi.Catalogo.Api/DTOs` | Contratos de entrada e saída. |
| `backend/Sesi.Catalogo.Api/Services` | Serviços de consulta do catálogo. |
| `backend/Sesi.Catalogo.Api/Models` | Entidades do domínio. |
| `backend/Sesi.Catalogo.Api/Data` | Contexto, configurações de persistência e carga inicial. |
| `backend/Sesi.Catalogo.Api/Migrations` | Histórico de evolução do esquema do banco. |
| `backend/tests` | Testes HTTP e verificação da carga inicial. |

## Modelo de dados

| Tabela | Conteúdo e relacionamentos |
| --- | --- |
| `Categories` | Categorias que agrupam os cursos. Uma categoria pode possuir vários cursos. |
| `Courses` | Nome completo e breve, descrição, categoria, modalidade, carga horária, público-alvo, status, imagem e data opcional. Cada curso pertence a uma categoria e pode possuir vários módulos. |
| `Modules` | Módulos vinculados a um curso, com nome e posição de exibição. Cada módulo pode possuir várias aulas. |
| `Lessons` | Aulas vinculadas a um módulo, com nome, descrição e posição de exibição. |

Os relacionamentos são `Categories 1:N Courses`, `Courses 1:N Modules` e `Modules 1:N Lessons`. As chaves de módulos e aulas incluem os respectivos pais, permitindo identificadores locais repetidos em cursos diferentes. A ordenação é definida pelo campo `Position`.

Uma categoria com cursos não pode ser excluída. A exclusão de um curso remove seus módulos e aulas em cascata. Essas regras pertencem ao modelo; não existem endpoints de exclusão. Consulte o [README do backend](backend/README.md) para detalhes das restrições.

## Instruções para execução

### Pré-requisitos

- SDK .NET 10.
- Node.js 22.12 ou superior, com npm.
- PostgreSQL com a extensão `unaccent` disponível.

Os comandos a seguir utilizam PowerShell e caminhos relativos à pasta `sesi-catalogo`. O uso de `npm.cmd` evita bloqueios de execução de `npm.ps1` no Windows.

### Inicialização dos serviços

Primeiro, siga a seção **Configuração do banco** abaixo. Em seguida, no primeiro terminal, na pasta `backend/Sesi.Catalogo.Api`, inicie a API:

```powershell
dotnet run --launch-profile http --urls http://localhost:5000
```

No segundo terminal, na pasta `frontend`:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra o endereço exibido pelo Vite e mantenha os dois serviços em execução. A política CORS de desenvolvimento permite as portas 5173 e 5174 do Vite e 4173 do preview, em `localhost` e `127.0.0.1`. Para utilizar outra porta, ajuste `Cors:AllowedOrigins` e reinicie a API.

O frontend utiliza `http://localhost:5000/api` por padrão. Para alterar esse endereço, crie `frontend/.env.local` com a configuração abaixo e reinicie o Vite:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

Variáveis com prefixo `VITE_` ficam disponíveis no navegador e devem conter apenas informações públicas.

## Configuração do banco

Crie o banco `sesi_catalogo` no PostgreSQL, pelo pgAdmin ou executando o SQL abaixo em uma conexão administrativa:

```sql
CREATE DATABASE sesi_catalogo;
```

Na pasta `backend/Sesi.Catalogo.Api`, restaure as dependências, configure a conexão local e aplique as migrations:

```powershell
dotnet restore
dotnet tool restore
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=sesi_catalogo;Username=postgres;Password=SUA_SENHA"
dotnet ef database update -- --environment Development
```

Substitua usuário, senha, host e porta conforme sua instalação. Se a conexão já estiver salva, não é necessário repetir os comandos de User Secrets. A senha fica fora do repositório.

As migrations criam as tabelas e a extensão `unaccent`; o usuário do banco precisa ter permissão para essas operações. A carga inicial insere três categorias, seis cursos, doze módulos e dezessete aulas. Reexecutar a atualização preserva os registros existentes e não duplica a carga. As migrations são aplicadas explicitamente por comando, antes da execução da API.

## Endpoints

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/api/courses` | Lista com `items` e `total` |
| GET | `/api/courses/{id}` | Detalhes, módulos e aulas |
| GET | `/api/categories` | Categorias |

Pesquisa e filtros podem ser combinados com `search`, `category`, `modality` e `status`. A busca ignora acentos e maiúsculas. Exemplo: `/api/courses?search=fisica&category=ciencias-natureza&modality=Semipresencial`.

A API retorna `400` para parâmetros inválidos, `404` para cursos inexistentes e `500` para falhas internas. Pesquisas sem resultados retornam `200` com a lista vazia. Consulte o [README do backend](backend/README.md) para os contratos e valores aceitos nos filtros.

O frontend aguarda 250 ms após a última digitação antes de enviar a pesquisa e cancela requisições anteriores para evitar a exibição de respostas desatualizadas.

## Validação

Na pasta `frontend`:

```powershell
npm.cmd test
npm.cmd run build
```

Na pasta `backend`, com a API rodando na porta 5000:

```powershell
node --test tests/api.test.mjs
dotnet run --project tests/SeedVerification/SeedVerification.csproj --configuration Release
```

Os roteiros de navegador exigem `playwright-core` com Chromium disponível e API/frontend em execução. Configure `PLAYWRIGHT_MODULE` e `TEST_BASE_URL` conforme o [README do frontend](frontend/README.md). Na pasta `frontend`, execute:

```powershell
node tests/catalog.browser.cjs
node tests/integration.browser.cjs
```

## Estratégia de responsividade

O catálogo utiliza grade adaptável de cartões e filtros que passam de quatro para duas ou uma coluna conforme o espaço disponível. O cabeçalho apresenta menu móvel em telas pequenas, e a sala de aula adapta o menu lateral.

Foi verificada a ausência de rolagem horizontal no catálogo em larguras de 320, 375, 768, 1024 e 1440 px, em Chromium.

## Decisões de acessibilidade

- Rótulos nos formulários e controles nativos para facilitar a identificação e a operação dos campos.
- Navegação por teclado, foco visível e link para pular ao conteúdo principal.
- Contagem de resultados anunciada por região de status e mensagens para erros e indisponibilidade.
- Respeito à preferência por movimento reduzido.
- Ajustes de rolagem e foco para considerar o cabeçalho e a barra de matrícula.

Os fluxos principais e o link de pular ao conteúdo foram verificados em Chromium. A auditoria integral com leitor de tela e outros navegadores permanece pendente.

## Processo de publicação

O frontend está preparado para a Vercel em `frontend/vercel.json`, com build Vite e redirecionamento das rotas para `index.html`. A API .NET e o PostgreSQL precisam ser hospedados separadamente. O procedimento detalhado está no [guia de publicação](DEPLOY_VERCEL.md).

1. Disponibilize um PostgreSQL persistente com a extensão `unaccent` e configure `ConnectionStrings__DefaultConnection` no ambiente da API.
2. Aplique as migrations ao banco remoto e publique a API com HTTPS. O build da API é produzido por `dotnet publish --configuration Release`; também há um Dockerfile para hospedagem compatível.
3. Importe o frontend na Vercel e configure `VITE_API_BASE_URL` com a URL HTTPS pública da API, incluindo `/api`. O build é produzido por `npm.cmd run build`.
4. Configure `Cors__AllowedOrigins__0` na API com a origem definitiva do frontend e reinicie a API.
5. Confira acesso direto às rotas, pesquisa, filtros, detalhes e comunicação com o banco no ambiente publicado.

Configure a conexão do banco exclusivamente no ambiente da API. As variáveis `VITE_` são incorporadas ao frontend durante o build; alterações nesses valores exigem uma nova publicação. O serviço gratuito do Render pode apresentar atraso na primeira requisição após um período de inatividade, conforme o aviso exibido no painel de hospedagem.

## Limitações conhecidas

- A sala de aula é demonstrativa, com progresso fixo, sem inscrição real, autenticação ou integração com Moodle.
- O escopo da API contempla consultas; não há funcionalidades de cadastro, edição ou exclusão de cursos.
- As fotos dos seis cursos diferem das referências do Figma e foram substituídas intencionalmente por imagens relacionadas ao conteúdo de cada oferta.
- Páginas institucionais e redes sociais sem destino estão desativadas no rodapé; algumas telas apresentam mensagens de conteúdo futuro.
- A reprodução do vídeo depende da configuração de `VITE_PRESENTATION_VIDEO_URL`. Sem uma URL configurada, a interface apresenta uma mensagem de indisponibilidade.
- A comparação visual integral com o Figma e a auditoria completa de acessibilidade com leitor de tela e outros navegadores permanecem pendentes.
- O backend utiliza hospedagem gratuita no Render e pode apresentar atraso na primeira requisição após um período de inatividade.

O registro de uso de Inteligência Artificial está no arquivo separado [USO_DE_IA.md](USO_DE_IA.md), na raiz do projeto, abrangendo frontend e backend.
