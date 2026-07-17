# Design system

Direção visual oficial da Pizza Express: vermelho, vinho, branco e superfícies neutras, com composição baseada no Figma fornecido. A marca utiliza o logotipo e o banner presentes em `assets/images`.

## Fundamentos

Tokens globais cobrem cores, elevação, raios, largura, header e transições. Componentes são pequenos e específicos: botões, campos, badges, cards, overlays, feedback, preço, quantidade, cards de categoria/produto, grid, cabeçalho de seção e container.

## Tipografia

- Figtree (`next/font/google`), pesos 400, 500, 600 e 700: textos, parágrafos, botões, campos, navegação e títulos de cards (`h3`).
- Test Söhne Breit Buch (`assets/font/TestSohneBreit-Buch.otf`), peso 400: títulos expandidos.
- Test Söhne Breit Kräftig (`assets/font/TestSohneBreit-Kraftig.otf`), peso 500: títulos de maior ênfase.

Figtree é carregada pelo Google Fonts com `next/font/google`; Test Söhne Breit permanece local via `next/font/local`. Ambas são expostas pelas variáveis `--font-body` e `--font-display`.

## Acessibilidade

Foco visível, alvos mínimos de toque, contraste, semântica, labels, textos alternativos, Escape em overlays, bloqueio de rolagem e preferência por movimento reduzido.

Breakpoints de verificação: 320, 375, 430, 768, 1024, 1280 e 1440 px.
