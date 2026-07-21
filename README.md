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

Há também uma área administrativa (`/admin`) para gestão de usuários, permissões, ofertas (CI) e repositórios de arquivos de cada central.

---

## Tecnologias

- React + Vite
- Tailwind CSS
- Lucide React (ícones)
- Gemini API (geração de layouts via IA, chamada direto do navegador)
- Vercel Analytics

---

## Como rodar

```bash
npm install
npm run dev       # ambiente de desenvolvimento
npm run build     # build de produção em dist/
npm run preview   # pré-visualiza o build de produção
```

---

## Estrutura do projeto

```
editorLebes/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
│
├── public/
│   └── favicon.png
│
└── src/
    ├── main.jsx                      ← Ponto de entrada React
    ├── App.jsx                       ← Estado principal, roteamento multi-view
    ├── styles/
    │   └── global.css                ← Tailwind + fontes + scrollbar
    │
    ├── views/                        ← Telas do Hub
    │   ├── HubHome.jsx               ← Home com grid 2×2 dos módulos
    │   ├── LoginScreen.jsx           ← Tela de login + "esqueci minha senha"
    │   ├── StudioHome.jsx            ← Home do Estúdio Criativo
    │   ├── CentralMarcas.jsx         ← Identidade visual das marcas
    │   ├── CentralCampanhas.jsx      ← Arquivos e calendário de campanhas
    │   ├── CentralApoio.jsx          ← Tutoriais, FAQ e contatos
    │   ├── AdminLebes.jsx            ← Raiz da área administrativa
    │   └── Error404.jsx              ← Página 404 / 403
    │
    ├── components/
    │   ├── HomePage.jsx              ← Lista de todos os projetos salvos
    │   │
    │   ├── hub/
    │   │   ├── HubHeader.jsx         ← Header compartilhado (variant hub/inner)
    │   │   └── HubDrawer.jsx         ← Menu lateral deslizante do Hub
    │   │
    │   ├── admin/                    ← Telas e componentes da área administrativa
    │   │   ├── AdminSidebar.jsx      ← Sidebar do Admin
    │   │   ├── AdminDashboard.jsx    ← Dashboard com stats e calendário
    │   │   ├── ControleCI.jsx        ← Lista de CIs (Controle Interno)
    │   │   ├── CIOfertas.jsx         ← Ofertas de uma CI específica
    │   │   ├── CadastrarCI.jsx       ← Wizard de criação de CI
    │   │   ├── CadastrarOfertaIndividual.jsx ← Formulário de oferta avulsa
    │   │   ├── RepositorioArquivos.jsx ← Tabela de arquivos por repositório
    │   │   ├── EnviarArquivo.jsx     ← Wizard de envio de arquivo
    │   │   └── shared.jsx            ← AdminNav, Toggle, Stepper etc.
    │   │
    │   ├── canvas/
    │   │   ├── BackgroundLayer.jsx   ← Fundo da página (cor, gradiente, imagem)
    │   │   ├── CanvasElement.jsx     ← Elemento individual (drag, resize, seleção)
    │   │   └── StaticPage.jsx        ← Renderização estática (modo apresentação)
    │   │
    │   ├── elements/
    │   │   ├── ProductContent.jsx    ← Slot de produto (nome, código, preço)
    │   │   ├── PriceTag.jsx          ← Etiqueta de preço (parcelas, à vista)
    │   │   ├── TextContent.jsx       ← Texto editável (contentEditable)
    │   │   ├── ImageContent.jsx      ← Imagem com objectFit configurável
    │   │   ├── BoxContent.jsx        ← Caixa/forma (fill, borda, radius)
    │   │   └── IconContent.jsx       ← Ícone Lucide como elemento independente
    │   │
    │   ├── sidebar/
    │   │   └── LeftSidebar.jsx       ← Rail de painéis: modelos, elementos,
    │   │                                produtos, marca, IA, uploads, projetos
    │   │
    │   ├── modals/
    │   │   ├── Modal.jsx             ← Componente base reutilizável
    │   │   ├── FormatModal.jsx       ← Seleção e criação de formato (mm → px)
    │   │   ├── ExportModal.jsx       ← Exportar páginas (PDF/PNG/ZIP) ou JSON editável
    │   │   ├── AIGenerateModal.jsx   ← Geração de layouts com IA (local + Gemini)
    │   │   ├── ProjectsModal.jsx     ← Salvar, abrir, importar e exportar projetos
    │   │   └── SaveTemplateModal.jsx ← Salvar página como template reutilizável
    │   │
    │   ├── panels/
    │   │   ├── Properties.jsx        ← Painel de propriedades do elemento selecionado
    │   │   ├── PageProperties.jsx    ← Painel de propriedades da página
    │   │   └── LayersList.jsx        ← Lista de camadas com reordenação por drag
    │   │
    │   ├── popovers/
    │   │   ├── BackgroundPopover.jsx ← Editor de fundo (cor, gradiente, imagem)
    │   │   └── GridPopover.jsx       ← Gerador de grade de produtos
    │   │
    │   ├── preview/
    │   │   └── PresentationMode.jsx  ← Modo apresentação em tela cheia
    │   │
    │   ├── templates/
    │   │   └── SavedTemplateRow.jsx  ← Card de template salvo (aplicar, renomear, excluir)
    │   │
    │   ├── mobile/
    │   │   ├── MobileBottomBar.jsx   ← Barra inferior de ações no mobile
    │   │   └── MobileBottomSheet.jsx ← Painel deslizante inferior no mobile
    │   │
    │   └── ui/
    │       ├── DownloadToast.jsx     ← Pilha de toasts de progresso de download
    │       ├── IconBtn.jsx           ← Botão pequeno com ícone
    │       └── NumField.jsx          ← Campo numérico com limites min/max
    │
    ├── constants/
    │   ├── pageConfig.js             ← Formatos, dimensões, paleta de cores Lebes
    │   └── background.js             ← Presets de fundo, normalização, CSS gerado
    │
    ├── data/
    │   ├── products.js               ← Catálogo mockado de produtos (legado)
    │   ├── ci.js                     ← Modelo de dados de CI (Controle Interno) e ofertas
    │   ├── templates.jsx             ← Templates pré-prontos (grade 3×2, 2×3, destaque)
    │   ├── brandAssets.js            ← Logos e selos em SVG/data URI
    │   ├── icons.js                  ← Mapa de ícones Lucide por produto
    │   └── lebesExamples.js          ← Exemplos de páginas para few-shot do Gemini
    │
    └── utils/
        ├── helpers.js                ← uid, fmt, splitMoney, clamp, readImageScaled
        ├── aiGenerator.js            ← Gerador local de layouts (sem API externa)
        ├── geminiClient.js           ← Integração com Gemini API
        └── pdfExport.js              ← Serializa páginas do editor para exportação
```

---

## Sistema de roteamento

`App.jsx` gerencia a navegação via estado `view` (sem react-router):

| `view` | Componente | Descrição |
|---|---|---|
| `'hub'` | `HubHome` | Home principal do Hub |
| `'login'` | `LoginScreen` | Tela de login + "esqueci minha senha" |
| `'studio'` | `StudioHome` | Home do Estúdio Criativo |
| `'marcas'` | `CentralMarcas` | Central das Marcas |
| `'campanhas'` | `CentralCampanhas` | Central de Campanhas |
| `'apoio'` | `CentralApoio` | Central de Apoio |
| `'admin'` | `AdminLebes` | Área administrativa |
| `'404'` / `'403'` | `Error404` | Página não encontrada / sem permissão |
| `'home'` | `HomePage` | Lista de todos os projetos salvos |
| `'editor'` | *(JSX inline em `App.jsx`)* | Canvas de edição de peças |

---

## Schema dos elementos

Todos os elementos compartilham: `id`, `type`, `x`, `y`, `w`, `h`, `rotation`, `opacity`, `hidden`, `locked`.

| `type` | Propriedades exclusivas |
|---|---|
| `text` | `text`, `fontSize`, `color`, `weight`, `strike`, `align`, `font` |
| `box` | `fill` (aceita `'transparent'`), `borderW`, `borderColor`, `borderStyle` (`solid`/`dashed`/`dotted`), `radius` |
| `product` | `productId`, `fill` (aceita `'transparent'`), `radius`, `layout`, `fields`, `fontSizes` |
| `image` | `src`, `objectFit` |
| `icon` | `iconName`, `color` |
