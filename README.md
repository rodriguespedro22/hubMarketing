# Editora Lebes — Projeto React organizado

Este projeto foi reorganizado a partir do arquivo único `lebes-editor (1).jsx`.

## Como rodar

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura principal

```txt
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── canvas/
│   ├── catalog/
│   ├── elements/
│   ├── modals/
│   ├── panels/
│   ├── popovers/
│   ├── templates/
│   └── ui/
├── constants/
├── data/
├── styles/
├── utils/
└── legacy/
```

## Observações

- A lógica original foi mantida.
- O arquivo original também foi preservado em `src/legacy/lebes-editor.original.jsx`.
- Os dados mockados foram movidos para `src/data`.
- Configurações de página e fundos foram movidas para `src/constants`.
- Funções auxiliares foram movidas para `src/utils`.
- Componentes visuais foram separados por responsabilidade.
