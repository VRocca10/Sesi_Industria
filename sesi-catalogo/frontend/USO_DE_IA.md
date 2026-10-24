# Uso de Inteligência Artificial

## Ferramenta e objetivo

Codex, da OpenAI, utilizado para implementar e revisar o front-end React/TypeScript, adaptar os layouts às imagens fornecidas e verificar requisitos do desafio. Todos os dados educacionais nesta etapa são fictícios.

## Solicitações relevantes e aproveitamento

- “Cada matéria ter sua tela respectiva”: aproveitada a parametrização das rotas e do conteúdo com os dados de cada curso.
- “Falando nos requisitos exclusivos do front, o que preciso fazer e o que está pronto”: aproveitada a revisão que identificou ausência de pesquisa, filtros combináveis, contagem e estados de catálogo.
- “Faça o que ainda falta, por favor”: implementados pesquisa, filtros, limpeza, resultados, estados visuais e apresentação das informações, mantendo a fonte local conforme solicitado.
- As imagens fornecidas orientaram espaçamento, cores, tipografia e navegação. Fotografias ausentes não foram substituídas por novas imagens geradas; foram reutilizados os recursos locais e essa diferença foi registrada.
- A integração com backend foi adiada por instrução do usuário, em vez de ser incluída nesta etapa.
- “Faça um code review [...] apenas performance e estrutura [...] não modifique nada de layout ou tela”: aproveitada a separação de componentes e hooks e a eliminação de processamento duplicado. Não foram introduzidas dependências ou alterações de CSS. Foram comparadas oito capturas de telas antes e depois da refatoração, sem diferenças.

## Validação

Na etapa inicial do backend, o Codex também foi utilizado para criar os modelos C#, o contexto e as configurações do EF Core e a migration inicial. Foram verificados compilação, aplicação ao PostgreSQL local, ausência de mudanças pendentes no modelo e repetição da atualização sem reaplicar a migration. A conexão usa User Secrets, sem registrar senha no código.

Na carga inicial, foi aproveitada a transformação dos dados fictícios do front-end em um recurso JSON incorporado ao backend. A inserção utiliza as rotinas síncrona e assíncrona de seeding do EF Core, preservando chaves e ordenação. O verificador local confirmou três categorias, seis cursos, doze módulos e dezessete aulas, comparou todos os campos e repetiu as duas rotinas sem duplicação ou alteração dos registros. Foi identificado um conflito de versões transitivas do Entity Framework no projeto de verificação; as referências de runtime e design foram alinhadas e fixadas antes de repetir os testes com sucesso.

Na etapa dos endpoints, o Codex criou DTOs, serviço de consulta e controllers para listar cursos, consultar detalhes e listar categorias. Foram utilizadas as documentações oficiais do PostgreSQL e do Npgsql para a busca com `unaccent` e `ILIKE`. Foram executados 34 testes HTTP contra o banco local, cobrindo dados completos, pesquisa, filtros, retorno vazio, validações, 404 e indisponibilidade de operações de escrita. A resposta 500 foi verificada em uma instância temporária com conexão inválida, confirmando ausência de detalhes da exceção no corpo da resposta. O front permaneceu sem integração nesta etapa.

- Compilação TypeScript e build Vite.
- Sete testes automatizados da pesquisa e dos filtros, incluindo acentos, nome breve, combinação de critérios e resultados vazios.
- Testes em Chromium de busca, seleção de filtros, persistência na URL, limpeza, navegação e disponibilidade de matrícula.
- Carregamento, erro e nova tentativa verificados com falha simulada pelo teste de navegador.
- Verificação de ausência de overflow horizontal do catálogo em cinco larguras, além do link de pular ao conteúdo por teclado.
- Inspeção de captura do catálogo. A auditoria completa com leitor de tela e a comparação integral com Figma não foram realizadas.

## Exemplo de inadequação e correção

A primeira implementação permitia que cursos “Em breve” e “Encerrado” exibissem o mesmo botão de matrícula dos cursos disponíveis. O status não era mostrado no catálogo.

Correção: status passou a aparecer nos cartões do catálogo e nos detalhes. Os dois controles de matrícula nos detalhes ficam desabilitados com mensagem correspondente para ofertas indisponíveis. O teste de navegador verifica esse comportamento para um curso de cada status indisponível.

O código gerado por IA foi ajustado durante a implementação e não foi considerado validado apenas por ter sido gerado.
