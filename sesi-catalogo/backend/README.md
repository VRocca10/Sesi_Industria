# Backend — Catálogo SESI + Indústria

Etapa atual: modelos, contexto Entity Framework Core, migrations, carga inicial e endpoints de consulta implementados e verificados no PostgreSQL. O front-end ainda utiliza os dados locais e será integrado em uma próxima etapa.

## Tecnologias

C#, ASP.NET Core 10, Entity Framework Core 10 e PostgreSQL com o provedor Npgsql. A ferramenta `dotnet-ef` está registrada no manifesto local da API.

## Estrutura

- `Sesi.Catalogo.Api/Models`: categoria, curso, módulo e aula.
- `Sesi.Catalogo.Api/Data/AppDbContext.cs`: contexto do banco.
- `Sesi.Catalogo.Api/Data/Configurations`: configuração das tabelas e relacionamentos.
- `Sesi.Catalogo.Api/Migrations`: criação e histórico do esquema.
- `Sesi.Catalogo.Api/Data/Seed`: dados fictícios e carga inicial idempotente.
- `tests/SeedVerification`: verificação dos dados gravados e da repetição da carga.
- `Sesi.Catalogo.Api/Controllers`: endpoints de cursos e categorias, além do exemplo temporário do template.
- `Sesi.Catalogo.Api/DTOs`: contrato JSON e validação de parâmetros.
- `Sesi.Catalogo.Api/Services`: consultas assíncronas ao catálogo.
- `tests/api.test.mjs`: testes HTTP dos endpoints usando Node.js.

## Banco e modelo

Crie o banco `sesi_catalogo` no PostgreSQL local antes de aplicar as migrations.

As tabelas são `Categories`, `Courses`, `Modules` e `Lessons`. O EF também mantém `__EFMigrationsHistory`.

Cada curso pertence a uma categoria e contém módulos, que contêm aulas. Todos os campos exigidos para um curso estão em `Course`; `AvailableFrom` é uma data opcional. Os identificadores textuais preservam os endereços já utilizados pelo front-end.

Módulos possuem chave composta por curso e identificador, permitindo reutilizar o mesmo identificador em cursos diferentes. A chave das aulas também inclui o módulo. `Position` define a ordem de módulos e aulas e é única dentro de cada pai. As posições e a carga horária precisam ser positivas. Modalidades e status são limitados aos valores utilizados no catálogo.

Uma categoria com cursos não pode ser excluída. A exclusão de um curso remove seus módulos e aulas em cascata. Essas regras protegem a integridade do banco; não há endpoints de exclusão previstos pelo desafio.

## Configuração local

Na pasta `backend/Sesi.Catalogo.Api`, execute:

```powershell
dotnet restore
dotnet tool restore
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=sesi_catalogo;Username=postgres;Password=SUA_SENHA"
dotnet ef database update -- --environment Development
dotnet run --launch-profile http --urls http://localhost:5000
```

O perfil `http` configura o ambiente Development e permite carregar os User Secrets. Se usar `--no-launch-profile`, informe também `-- --environment Development` para carregar essa configuração local.

A senha deve ser configurada apenas no terminal local. Não inclua a conexão real no repositório. Para publicação, configure `ConnectionStrings__DefaultConnection` no ambiente da hospedagem, usando um usuário próprio da aplicação. Os logs são enviados ao console e não dependem de acesso ao Event Log do Windows.

## Verificações

```powershell
dotnet build
dotnet ef migrations has-pending-model-changes -- --environment Development
dotnet ef migrations list -- --environment Development
```

Validações realizadas nesta etapa: compilação sem avisos ou erros, primeira migration aplicada ao PostgreSQL, nenhuma mudança pendente entre modelo e migration e segunda execução de `database update` confirmando que o banco já estava atualizado.

Para conferir as tabelas pelo pgAdmin, atualize o banco e expanda `Schemas → public → Tables`.

## Carga inicial

`Data/Seed/catalog.json` contém os mesmos dados fictícios utilizados no front-end: três categorias, seis cursos, doze módulos e dezessete aulas. O arquivo é incorporado à compilação da API e não depende de arquivos do front-end para executar ou publicar o backend.

A carga utiliza `UseSeeding` e `UseAsyncSeeding` do EF Core. É executada ao aplicar ou atualizar o banco com migrations, inclusive quando não existem migrations pendentes. Não é executada a cada requisição nem na inicialização normal da API. As operações de migrations protegem a execução com o mecanismo de bloqueio do EF.

Registros já existentes são identificados por suas chaves e preservados. São adicionados apenas os registros ausentes, com os relacionamentos e posições originais. A gravação usa uma única chamada de `SaveChanges`, com transação automática do EF. Reexecutar a carga não duplica registros e não atualiza os dados que já existem. Para alterar um registro existente, será necessário definir uma operação específica em uma etapa futura.

Para aplicar a carga na pasta da API:

```powershell
dotnet ef database update -- --environment Development
```

Se a API estiver rodando e o Windows bloquear os arquivos de compilação Debug, pare-a com `Ctrl + C` antes do comando. Como alternativa, compile e execute as migrations em Release:

```powershell
dotnet build --configuration Release
dotnet ef database update --configuration Release --no-build -- --environment Development
```

Para verificar a carga, na pasta `backend`:

```powershell
dotnet run --project tests/SeedVerification/SeedVerification.csproj --configuration Release
```

O verificador utiliza os mesmos User Secrets da API ou a conexão fornecida por variável de ambiente. Deve ser executado contra o banco local do catálogo demonstrativo, sem dados adicionais. Ele compara todos os campos das quatro tabelas com os dados iniciais, confere a variedade de categorias, modalidades e status e repete as cargas síncrona e assíncrona para confirmar que nenhum registro foi duplicado ou alterado.

As verificações foram executadas com sucesso no PostgreSQL local. Para visualizar os registros no pgAdmin, clique com o botão direito em `Courses` e selecione `View/Edit Data → All Rows`. Se a grade já estiver aberta, execute a consulta novamente.

## Próximas etapas

Integração com o front-end, configuração de CORS, publicação gratuita e consolidação dos entregáveis. Não há integração com Moodle nesta etapa. O endpoint `GET /WeatherForecast` permanece temporariamente como exemplo.

## Endpoints

Com a API em execução na porta 5000:

| Método | Endereço | Resposta |
| --- | --- | --- |
| GET | `/api/courses` | Objeto com `items` e `total` dos resultados encontrados |
| GET | `/api/courses/{id}` | Detalhes do curso, incluindo categoria, módulos e aulas |
| GET | `/api/categories` | Lista de categorias com `id`, `name` e `icon` |

A listagem e os detalhes utilizam os nomes de propriedades em camelCase, compatíveis com os dados atuais do front: `id`, `fullName`, `shortName`, `description`, `category`, `modality`, `workloadHours`, `targetAudience`, `status`, `image`, `availableFrom` e `modules`. Cada módulo contém `id`, `name` e `lessons`, com `id`, `name` e `description`. Datas seguem `yyyy-MM-dd` e a data ausente é retornada como `null`. Chaves estrangeiras e propriedades de navegação do EF não são expostas.

A lista completa de seis cursos é pequena; por isso esta versão não usa paginação e inclui também módulos e aulas na listagem. `total` corresponde ao tamanho de `items`. Os cursos têm ordenação estável por nome e identificador, enquanto módulos e aulas respeitam `Position`.

Exemplo de retorno da listagem sem resultados:

```json
{"items":[],"total":0}
```

### Pesquisa e filtros

Os parâmetros opcionais são `search`, `category`, `modality` e `status`. Todos são combinados por interseção. Exemplos:

```text
http://localhost:5000/api/courses
http://localhost:5000/api/courses?search=fisica
http://localhost:5000/api/courses?search=ciencia
http://localhost:5000/api/courses?category=ciencias-natureza
http://localhost:5000/api/courses?search=metalurgia&category=ciencias-natureza&modality=Semipresencial&status=Dispon%C3%ADvel
http://localhost:5000/api/courses/matematica-precisao
http://localhost:5000/api/categories
```

`search` pesquisa nome completo, nome breve e categoria, sem diferenciar acentos ou maiúsculas. Espaços nas extremidades são desconsiderados. `%`, `_` e `\` são tratados como texto literal, sem permitir que virem curingas da consulta. As consultas são parametrizadas e executadas no banco, com `AsNoTracking`, projeção para DTOs, cancelamento e consultas separadas para as coleções, sem carregar entidades antes de aplicar os filtros.

A busca utiliza a extensão PostgreSQL [unaccent](https://www.postgresql.org/docs/current/unaccent.html) e as traduções do [Npgsql](https://www.npgsql.org/efcore/mapping/full-text-search.html). A migration `EnableUnaccentSearch` instala a extensão; a hospedagem escolhida deve disponibilizá-la e permitir sua criação durante a aplicação das migrations.

`category` usa o identificador, como `matematica` ou `ciencias-natureza`; uma categoria inexistente retorna uma lista vazia. `modality` aceita `A distância` ou `Semipresencial`. `status` aceita `Disponível`, `Em breve` ou `Encerrado`. Esses dois filtros exigem os valores exatos; campos vazios não filtram. O limite da pesquisa é 200 caracteres e o da categoria, 100.

### Respostas de erro

- `400`: modalidade/status inválidos ou limites excedidos; retorna ValidationProblemDetails com os campos em `errors`.
- `404`: curso inexistente; retorna ProblemDetails com o título `Curso não encontrado.`.
- `500`: falha interna, como indisponibilidade do banco; retorna ProblemDetails sem expor a exceção ao cliente. Os detalhes ficam nos logs do servidor.
- Sem resultados: `200`, com `items` vazio e `total` igual a zero.

Não existem endpoints de cadastro, edição ou exclusão. A documentação OpenAPI está disponível em `/openapi/v1.json` quando o ambiente é Development; não foi adicionada interface Swagger.

### Testes HTTP

Com a API atualizada em execução, na pasta `backend`:

```powershell
node --test tests/api.test.mjs
```

Se utilizar outra porta:

```powershell
$env:API_BASE_URL="http://localhost:5010"
node --test tests/api.test.mjs
```

Foram executados 34 testes HTTP contra o PostgreSQL, incluindo comparação dos dados dos seis cursos, ordenação de módulos/aulas, acentos compostos e decompostos, caracteres especiais, filtros combinados, quantidade de resultados, resposta vazia, validação, 404 e ausência de operações de gerenciamento. Também foi verificada separadamente a resposta 500 com o banco indisponível, sem expor detalhes da exceção. As instâncias temporárias utilizadas nos testes foram encerradas.
