# Hub de Marketing — Grupo Lebes

Plataforma front-end em React + Vite para o time de marketing do Grupo Lebes. Reúne quatro módulos em um hub central para criação, gestão e consulta de materiais de comunicação.

---

## Módulos

| Módulo | Descrição |
|---|---|
| **Estúdio Criativo** | Editor visual de peças gráficas (cards, revistas, banners) no padrão da marca |
| **Central das Marcas** | Guia de identidade visual: logotipos, cores, tipografia e tom de voz |
| **Central de Campanhas** | Repositório de arquivos de campanha e calendário mensal de eventos |
| **Central de Apoio** | Tutoriais, FAQ e contatos do time de marketing |

---

## Tecnologias

**Front-end**
- React + Vite
- Tailwind CSS
- Lucide React (ícones)
- Gemini API (geração de layouts via IA)
- Vercel Analytics

## Estrutura do projeto

```
editorLebes/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
│
├── backend/                        ← API Node/Express (branch dev)
│   ├── .env.example
│   └── src/
│       ├── index.js                ← Express, CORS, body limit 50mb
│       ├── routes/
│       │   ├── export.js           ← POST /api/export/pdf
│       │   └── products.js         ← GET /api/products (placeholder)
│       └── services/
│           └── pdfService.js       ← Chromium headless via Playwright
│
└── src/
    ├── main.jsx                    ← Ponto de entrada React
    ├── App.jsx                     ← Estado principal, roteamento multi-view
    ├── styles/
    │   └── global.css              ← Tailwind + fontes + scrollbar
    │
    ├── views/                      ← Telas do Hub
    │   ├── HubHome.jsx             ← Home com grid 2×2 dos módulos
    │   ├── StudioHome.jsx          ← Home do Estúdio Criativo
    │   ├── CentralMarcas.jsx       ← Identidade visual das marcas
    │   ├── CentralCampanhas.jsx    ← Arquivos e calendário de campanhas
    │   └── CentralApoio.jsx        ← Tutoriais, FAQ e contatos
    │
    ├── components/
    │   ├── HomePage.jsx            ← Lista de todos os projetos salvos
    │   │
    │   ├── hub/
    │   │   ├── HubHeader.jsx       ← Header compartilhado (variant hub/inner)
    │   │   └── HubDrawer.jsx       ← Menu lateral deslizante do Hub
    │   │
    │   ├── canvas/
    │   │   ├── BackgroundLayer.jsx ← Fundo da página (cor, gradiente, imagem)
    │   │   ├── CanvasElement.jsx   ← Elemento individual (drag, resize, seleção)
    │   │   └── StaticPage.jsx      ← Renderização estática (PDF e apresentação)
    │   │
    │   ├── catalog/
    │   │   └── Catalog.jsx         ← Catálogo de produtos com busca e filtro
    │   │
    │   ├── elements/
    │   │   ├── ProductContent.jsx  ← Slot de produto (nome, código, preço)
    │   │   ├── PriceTag.jsx        ← Etiqueta de preço (parcelas, à vista)
    │   │   ├── TextContent.jsx     ← Texto editável (contentEditable)
    │   │   ├── ImageContent.jsx    ← Imagem com objectFit configurável
    │   │   └── BoxContent.jsx      ← Caixa/forma (fill, borda, radius)
    │   │
    │   ├── sidebar/
    │   │   └── LeftSidebar.jsx     ← Rail de painéis: modelos, elementos,
    │   │                              produtos, marca, IA, uploads, projetos
    │   │
    │   ├── modals/
    │   │   ├── Modal.jsx           ← Componente base reutilizável
    │   │   ├── FormatModal.jsx     ← Seleção e criação de formato (mm → px)
    │   │   ├── ExportModal.jsx     ← Exportar PDF RGB, CMYK ou JSON
    │   │   ├── AIGenerateModal.jsx ← Geração de layouts com IA (local + Gemini)
    │   │   ├── ProjectsModal.jsx   ← Salvar, abrir, importar e exportar projetos
    │   │   └── SaveTemplateModal.jsx ← Salvar página como template reutilizável
    │   │
    │   ├── panels/
    │   │   ├── Properties.jsx      ← Painel de propriedades do elemento selecionado
    │   │   ├── PageProperties.jsx  ← Painel de propriedades da página
    │   │   ├── LayersList.jsx      ← Lista de camadas com reordenação por drag
    │   │   └── PanelToggleMenu.jsx ← Controle de visibilidade dos painéis
    │   │
    │   ├── popovers/
    │   │   ├── BackgroundPopover.jsx ← Editor de fundo (cor, gradiente, imagem)
    │   │   ├── GridPopover.jsx     ← Gerador de grade de produtos
    │   │   └── ToolbarMenu.jsx     ← Menu genérico da barra de ferramentas
    │   │
    │   ├── preview/
    │   │   └── PresentationMode.jsx ← Modo apresentação em tela cheia
    │   │
    │   ├── templates/
    │   │   └── SavedTemplateRow.jsx ← Card de template salvo (aplicar, renomear, excluir)
    │   │
    │   ├── mobile/
    │   │   ├── MobileBottomBar.jsx ← Barra inferior de ações no mobile
    │   │   └── MobileBottomSheet.jsx ← Painel deslizante inferior no mobile
    │   │
    │   └── ui/
    │       ├── IconBtn.jsx         ← Botão pequeno com ícone
    │       └── NumField.jsx        ← Campo numérico com limites min/max
    │
    ├── constants/
    │   ├── pageConfig.js           ← Formatos, dimensões, paleta de cores Lebes
    │   └── background.js           ← Presets de fundo, normalização, CSS gerado
    │
    ├── data/
    │   ├── products.js             ← Catálogo mockado de produtos
    │   ├── templates.jsx           ← Templates pré-prontos (grade 3×2, 2×3, destaque)
    │   ├── brandAssets.js          ← Logos e selos em SVG/data URI
    │   ├── icons.js                ← Mapa de ícones Lucide por produto
    │   └── lebesExamples.js        ← Exemplos de páginas para few-shot do Gemini
    │
    ├── utils/
        ├── helpers.js              ← uid, fmt, splitMoney, clamp, readImageScaled
        ├── aiGenerator.js          ← Gerador local de layouts (sem API externa)
        ├── geminiClient.js         ← Integração com Gemini API
        └── pdfExport.js            ← Serializa páginas e chama POST /api/export/pdf
```

---

## Sistema de roteamento

`App.jsx` gerencia a navegação via estado `view` (sem react-router):

| `view` | Tela exibida |
|---|---|
| `'hub'` | Home principal do Hub |
| `'studio'` | Home do Estúdio Criativo |
| `'marcas'` | Central das Marcas |
| `'campanhas'` | Central de Campanhas |
| `'apoio'` | Central de Apoio |
| `'home'` | Lista de todos os projetos salvos |
| `'editor'` | Canvas do editor de peças |

---

## Editor de peças — funcionalidades

- Canvas com elementos de texto, imagem, caixa e slot de produto
- Drag, resize e rotação de elementos com suporte a zoom
- Seleção múltipla por área (marquee)
- Undo/redo com agrupamento de operações contínuas
- Camadas (reordenação, visibilidade, bloqueio)
- Grade automática de produtos (N colunas × M linhas)
- Múltiplas páginas por projeto
- Templates prontos e templates salvos pelo usuário
- Geração de layouts via IA (Gemini)
- Fundos: cor sólida, gradiente ou imagem
- Modo apresentação em tela cheia
- Exportação: PDF via Playwright (back-end) ou JSON editável
- Persistência em `localStorage` (projetos, templates, uploads, chave Gemini)

---

## Schema dos elementos

Todos os elementos compartilham: `id`, `type`, `x`, `y`, `w`, `h`, `rotation`, `opacity`, `hidden`, `locked`.

| `type` | Propriedades exclusivas |
|---|---|
| `text` | `text`, `fontSize`, `color`, `weight`, `align`, `font` |
| `box` | `fill`, `borderW`, `radius` |
| `product` | `productId`, `fill`, `radius` |
| `image` | `src`, `objectFit` |

---

## Exportação de PDF

1. O editor serializa cada página via `StaticPage.jsx` usando `renderToStaticMarkup`
2. O HTML resultante (com Tailwind CDN + Google Fonts embutidos) é enviado ao back-end via `POST /api/export/pdf`
3. O back-end abre o HTML no Chromium headless (Playwright) e gera o PDF
4. O arquivo é devolvido como `application/pdf` para download direto

> O limite de payload do Express está configurado em **50 MB** para suportar páginas com imagens em `data:` URL.

---

## Variáveis de ambiente

### Front-end (`.env` na raiz)

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base do back-end (ex: `http://localhost:3001`) |

### Back-end (`backend/.env`)

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão: `3001`) |
| `FRONTEND_URL` | Origem CORS permitida (ex: `http://localhost:5173`) |
| `GEMINI_API_KEY` | Chave da API Gemini (a migrar do localStorage) |

> Nunca commite arquivos `.env` com valores reais. Use `.env.example` como modelo.

---

## Branches

| Branch | Conteúdo | Deploy |
|---|---|---|
| `main` | Somente front-end | Vercel |
| `dev` | Front-end + back-end de teste | Railway / Render |

---

