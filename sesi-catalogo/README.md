# Catálogo SESI + Indústria

## Objetivo da aplicação

Aplicação demonstrativa do processo seletivo Desenvolvedor de Sistemas I. Permite consultar, pesquisar e filtrar seis cursos fictícios, visualizar detalhes e navegar por uma sala de aula demonstrativa.

Frontend publicado na Vercel: [Catálogo SESI + Indústria](https://sesi-industria-frontend.vercel.app/).

Backend no Render (endereço informado para a entrega): [API do catálogo](https://sesi-catalogo-api-64xg.onrender.com). Base dos endpoints: `https://sesi-catalogo-api-64xg.onrender.com/api`.

Não há integração com Moodle nem gerenciamento de cadastro, edição ou exclusão.

## Documentação da entrega

- [Uso de Inteligência Artificial](USO_DE_IA.md): ferramenta utilizada, objetivos, prompts, conteúdo aproveitado ou descartado, validação e exemplo de erro com a correção realizada.
- [Frontend](frontend/README.md): organização, funcionalidades e verificações da interface.
- [Backend](backend/README.md): banco de dados, carga inicial, endpoints e configuração da API.
- [Publicação](DEPLOY_VERCEL.md): configuração do frontend, da API externa e das variáveis de ambiente.
- [Revisão de código](frontend/CODE_REVIEW.md): ajustes de estrutura e verificações registradas.

## Funcionalidades

- Consulta de seis cursos fictícios, com pesquisa sem diferenciar acentos e maiúsculas.
- Filtros combinados por categoria, modalidade e status, contagem de resultados e filtros preservados na URL.
- Detalhes de cada curso, módulos, aulas e sala de aula demonstrativa.
- Bloqueio dos controles de matrícula para cursos com status “Em breve” ou “Encerrado”.
- Estados de carregamento, nenhum resultado, curso não encontrado e erro com nova tentativa.

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

- `frontend`: React, TypeScript, Vite, React Router, Axios e Swiper.
- `backend/Sesi.Catalogo.Api`: API C#/.NET 10, Entity Framework Core e Npgsql.
- `backend/Sesi.Catalogo.Api/Migrations`: esquema do banco e extensão de busca sem acentos.
- `backend/Sesi.Catalogo.Api/Data/Seed`: carga fictícia reproduzível, sem duplicação.
- `backend/tests`: verificação da carga e testes HTTP.
- `frontend/tests`: testes unitários e roteiros de navegador.

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

Requisitos: SDK .NET 10, PostgreSQL com a extensão `unaccent` disponível e Node.js 22.12 ou superior.

Primeiro, siga a seção **Configuração do banco** abaixo. Em seguida, no primeiro terminal, na pasta `backend/Sesi.Catalogo.Api`, inicie a API:

```powershell
dotnet run --launch-profile http --urls http://localhost:5000
```

No segundo terminal, na pasta `frontend`:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra o endereço exibido pelo Vite. A API precisa continuar rodando. As portas 5173 e 5174 do Vite e 4173 do preview, em `localhost` e `127.0.0.1`, estão liberadas no CORS de desenvolvimento. Para outra porta, ajuste `Cors:AllowedOrigins` e reinicie a API.

O front utiliza `http://localhost:5000/api` por padrão. Para alterar, crie `frontend/.env.local` com `VITE_API_BASE_URL` e reinicie o Vite. Não coloque credenciais em variáveis `VITE_`, pois elas são públicas no navegador.

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

A migration cria as tabelas e a extensão `unaccent`; o usuário do banco precisa ter permissão para essas operações. A carga inicial insere três categorias, seis cursos, doze módulos e dezessete aulas. Reaplicar a atualização não duplica os registros da carga. As migrations são executadas por comando, sem aplicação automática na inicialização da API.

## Endpoints

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/api/courses` | Lista com `items` e `total` |
| GET | `/api/courses/{id}` | Detalhes, módulos e aulas |
| GET | `/api/categories` | Categorias |

Pesquisa e filtros podem ser combinados com `search`, `category`, `modality` e `status`. A busca ignora acentos e maiúsculas. Exemplo: `/api/courses?search=fisica&category=ciencias-natureza&modality=Semipresencial`.

O front consulta a API para obter os cursos; não há fallback para os dados de teste. Carregamento, ausência de resultados, 404 e falhas de rede têm tratamento próprio. Consultas anteriores são canceladas e a pesquisa aguarda 250 ms sem digitação.

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

Não grave a conexão do banco no repositório nem em variáveis `VITE_`, que são públicas. O endereço do frontend publicado está informado no início deste documento. A validação da integração no ambiente publicado e a construção da imagem Docker não foram confirmadas nesta revisão documental.

O registro de uso de Inteligência Artificial está no arquivo separado [USO_DE_IA.md](USO_DE_IA.md), na raiz do projeto, abrangendo frontend e backend.
