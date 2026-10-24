# Publicação na Vercel

A Vercel hospeda o front React/Vite. A API ASP.NET Core e o PostgreSQL são serviços separados. Publicar somente o front não disponibiliza o catálogo sem uma API pública conectada ao banco.

## Preparar a API

Na hospedagem da API, configure as variáveis de ambiente:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=HOST;Port=5432;Database=BANCO;Username=USUARIO;Password=SENHA
Cors__AllowedOrigins__0=https://SEU-PROJETO.vercel.app
```

Use os parâmetros de SSL exigidos pelo provedor PostgreSQL. A conexão é um segredo exclusivo do back-end. A API deve ser acessível por HTTPS. Adicione outras origens explicitamente com `Cors__AllowedOrigins__1`, etc.; previews da Vercel possuem domínios diferentes e também precisam ser autorizados quando utilizados.

Antes de iniciar a API, aplique as migrations ao banco de produção a partir de `backend/Sesi.Catalogo.Api`, com a conexão configurada no ambiente:

```sh
dotnet tool restore
dotnet ef database update --configuration Release -- --environment Production
dotnet publish --configuration Release --output ./publish
```

As migrations precisam de acesso ao PostgreSQL, da extensão `unaccent` disponível e de permissão para criá-la. A atualização do banco também executa a carga fictícia. Publique a saída `publish` em uma hospedagem compatível com .NET 10. Este projeto não executa migrations automaticamente ao iniciar a API.

## Importar o repositório na Vercel

1. Envie o código para seu repositório GitHub e importe-o em um novo projeto na Vercel.
2. Configure **Root Directory** como `sesi-catalogo/frontend`, considerando o repositório atual `Sesi_Industria`. Se o repositório começar diretamente em `sesi-catalogo`, use `frontend`.
3. Selecione **Framework Preset: Vite** e **Node.js: 22.x**.
4. O arquivo `frontend/vercel.json` define instalação `npm ci`, build `npm run build` e saída `dist`.
5. Em **Environment Variables**, cadastre `VITE_API_BASE_URL=https://SUA-API/api` para Production e, se utilizados, Preview e Development.
6. Opcionalmente, configure `VITE_PRESENTATION_VIDEO_URL` com a URL HTTPS pública do vídeo. Sem ela, o site apresenta a mensagem de vídeo indisponível.
7. Execute o deploy. Configure a origem definitiva do front no CORS da API e reinicie o serviço da API.

As variáveis `VITE_` são públicas e entram no JavaScript durante o build. Não inclua senhas, conexão do banco ou tokens nelas. Alterações nessas variáveis exigem um novo deploy.

O build na Vercel falha com uma mensagem explícita se a URL da API estiver ausente, inválida, sem HTTPS ou apontando para localhost. O desenvolvimento local mantém `http://localhost:5000/api` como padrão.

## Conferir a publicação

- Abra `/cursos`, pesquise, combine filtros e confira a contagem.
- Abra `/cursos/matematica-precisao` diretamente e atualize a página. O rewrite para `index.html` mantém as rotas do React Router.
- Confira as imagens dos seis cursos e o acesso aos detalhes.
- Se houver erro de rede, confira a URL da API, HTTPS e a origem permitida no CORS. Não use localhost no front publicado.

A configuração foi preparada localmente; nenhum deploy, conta ou serviço pago foi criado. Escolha serviços gratuitos para front, API e banco, conforme o enunciado. Os links definitivos e o ZIP dos entregáveis continuam pendentes.

Referências: [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite), [variáveis de ambiente](https://vercel.com/docs/environment-variables) e [runtimes oficiais](https://vercel.com/docs/functions/runtimes).
