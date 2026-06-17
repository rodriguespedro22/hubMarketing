import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import StaticPage from '../components/canvas/StaticPage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FONT_LINK = [
  '<link rel="preconnect" href="https://fonts.googleapis.com" />',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
  '<link href="https://fonts.googleapis.com/css2?family=Gantari:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&family=Raleway:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />',
].join('\n  ');

function buildSinglePageDocument(html, widthPx, heightPx) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  ${FONT_LINK}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: white; width: ${widthPx}px; height: ${heightPx}px; overflow: hidden; }
  </style>
</head>
<body>${html}</body>
</html>`;
}

function buildMultiPageDocument(pageHtmls, widthPx, heightPx) {
  const body = pageHtmls
    .map(html => `<div class="pdf-page">${html}</div>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  ${FONT_LINK}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: ${widthPx}px ${heightPx}px; margin: 0; }
    body { background: white; }
    .pdf-page {
      width: ${widthPx}px;
      height: ${heightPx}px;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
    }
    .pdf-page:last-child { page-break-after: avoid; break-after: avoid; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

async function postAndDownload(html, widthPx, heightPx, filename) {
  const response = await fetch(`${API_URL}/api/export/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, widthPx, heightPx, filename }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${response.status} ao gerar PDF`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporta todas as páginas do projeto como um único PDF.
 * Usa renderToStaticMarkup para serializar cada página sem manipular o DOM,
 * eliminando a necessidade de limpar seleção ou aguardar re-render.
 */
export async function exportAllPagesAsPdf({ pages, format, filename = 'editor-lebes' }) {
  const pageHtmls = pages.map(page =>
    renderToStaticMarkup(createElement(StaticPage, { page, format }))
  );
  const html = buildMultiPageDocument(pageHtmls, format.w, format.h);
  await postAndDownload(html, format.w, format.h, filename);
}

/**
 * Exporta todas as páginas do projeto como JPEGs em resolução 3×.
 * Cada página vira um arquivo .jpg dentro de um .zip.
 */
export async function exportAllPagesAsJpg({ pages, format, filename = 'editor-lebes' }) {
  const pagePayloads = pages.map(page => ({
    html: buildSinglePageDocument(
      renderToStaticMarkup(createElement(StaticPage, { page, format })),
      format.w,
      format.h,
    ),
  }));

  const response = await fetch(`${API_URL}/api/export/jpg`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pages: pagePayloads, widthPx: format.w, heightPx: format.h, projectName: filename }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${response.status} ao gerar JPGs`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
