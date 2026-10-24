# Catálogo SESI + Indústria

Aplicação demonstrativa do processo seletivo Desenvolvedor de Sistemas I. Permite consultar, pesquisar e filtrar seis cursos fictícios, visualizar detalhes e navegar por uma sala de aula demonstrativa.

O fluxo integrado é `React → API ASP.NET Core → PostgreSQL`. Não há integração com Moodle nem gerenciamento de cadastro, edição ou exclusão.

## Estrutura e tecnologias

- `frontend`: React, TypeScript, Vite, React Router, Axios e Swiper.
- `backend/Sesi.Catalogo.Api`: API C#/.NET 10, Entity Framework Core e Npgsql.
- `backend/Sesi.Catalogo.Api/Migrations`: esquema do banco e extensão de busca sem acentos.
- `backend/Sesi.Catalogo.Api/Data/Seed`: carga fictícia reproduzível, sem duplicação.
- `backend/tests`: verificação da carga e testes HTTP.
- `frontend/tests`: testes unitários e roteiros de navegador.

As tabelas são `Categories`, `Courses`, `Modules` e `Lessons`. Um curso pertence a uma categoria e possui módulos com aulas ordenadas. O modelo cobre nomes completo/breve, descrição, categoria, modalidade, carga horária, público-alvo, status, imagem e data opcional.

## Executar localmente

Requisitos: SDK .NET 10, PostgreSQL com a extensão `unaccent` disponível e Node.js 22.12 ou superior. Crie o banco `sesi_catalogo` no PostgreSQL.

No primeiro terminal, na pasta `backend/Sesi.Catalogo.Api`:

```powershell
dotnet restore
dotnet tool restore
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=sesi_catalogo;Username=postgres;Password=SUA_SENHA"
dotnet ef database update -- --environment Development
dotnet run --launch-profile http --urls http://localhost:5000
```

Se a conexão já estiver salva, não é necessário executar novamente os comandos de User Secrets. A migration cria as tabelas e a extensão; a carga inicial insere três categorias, seis cursos, doze módulos e dezessete aulas. A senha fica fora do repositório.

No segundo terminal, na pasta `frontend`:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra o endereço exibido pelo Vite. A API precisa continuar rodando. As portas 5173 e 5174 do Vite e 4173 do preview, em `localhost` e `127.0.0.1`, estão liberadas no CORS de desenvolvimento. Para outra porta, ajuste `Cors:AllowedOrigins` e reinicie a API.

O front utiliza `http://localhost:5000/api` por padrão. Para alterar, crie `frontend/.env.local` com `VITE_API_BASE_URL` e reinicie o Vite. Não coloque credenciais em variáveis `VITE_`, pois elas são públicas no navegador.

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

Os roteiros de navegador exigem `playwright-core` com Chromium disponível; configure `PLAYWRIGHT_MODULE` e `TEST_BASE_URL` e execute `frontend/tests/catalog.browser.cjs` e `frontend/tests/integration.browser.cjs` a partir da pasta do front.

## Responsividade e acessibilidade

Grade adaptável de cartões, filtros em uma a quatro colunas, menu móvel e adaptação da sala de aula. Os controles incluem rótulos, navegação por teclado, foco visível, estados anunciados e respeito a movimento reduzido. Foram verificados os fluxos principais em Chromium e cinco larguras do catálogo. Auditoria integral com leitor de tela e outros navegadores ainda está pendente.

## Publicação e limitações

A configuração do front para Vercel está pronta em `frontend/vercel.json`, incluindo as rotas do React Router. Consulte [o guia de deploy](DEPLOY_VERCEL.md) para configurar o projeto, as variáveis e a API externa. O deploy ainda não foi realizado. Os builds são produzidos por `npm.cmd run build` no front e `dotnet publish --configuration Release` na API. A hospedagem do front precisa redirecionar as rotas para `index.html`. Na publicação, configure `VITE_API_BASE_URL`, `ConnectionStrings__DefaultConnection` e as origens `Cors__AllowedOrigins__0`, sem gravar a senha no repositório. O banco precisa manter os dados de forma persistente e oferecer a extensão `unaccent`.

O ZIP de publicação e os links finais ainda serão preparados. A sala de aula é demonstrativa, com progresso fixo, sem inscrição real, autenticação ou Moodle. As fotos dos seis cursos foram substituídas por imagens específicas de cada conteúdo para facilitar sua identificação; essa é uma diferença intencional em relação ao Figma; páginas institucionais e redes sem destino estão desativadas no rodapé. O vídeo depende de uma URL configurada. A comparação integral com o Figma permanece pendente.

Detalhes técnicos: [front-end](frontend/README.md), [backend](backend/README.md), [uso de IA](frontend/USO_DE_IA.md) e [revisão de código](frontend/CODE_REVIEW.md).
