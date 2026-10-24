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
