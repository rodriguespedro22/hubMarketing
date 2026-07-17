import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import StaticPage from '../components/canvas/StaticPage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const EXPORT_API_KEY = import.meta.env.VITE_EXPORT_API_KEY || '';

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

/**
 * Faz o POST e lê a resposta em stream, reportando progresso (0–100) com base em
 * bytes recebidos vs. Content-Length. Se o navegador ou a resposta não suportarem
 * streaming, cai para `response.blob()` e reporta 100% de uma vez.
 */
async function fetchWithProgress(url, body, onProgress) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(EXPORT_API_KEY ? { 'x-api-key': EXPORT_API_KEY } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${response.status} ao exportar`);
  }

  const total = Number(response.headers.get('Content-Length')) || 0;
  if (!response.body || !total) {
    const blob = await response.blob();
    onProgress?.(100);
    return blob;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress?.(Math.min(99, Math.round((received / total) * 100)));
  }
  onProgress?.(100);
  return new Blob(chunks);
}

/** Dispara o download do blob no navegador (usada tanto no sucesso quanto no "clique aqui" de fallback). */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporta as páginas informadas (todas ou um subconjunto) como um único PDF (PDF Digital, RGB).
 * Usa renderToStaticMarkup para serializar cada página sem manipular o DOM,
 * eliminando a necessidade de limpar seleção ou aguardar re-render.
 */
export async function exportPagesAsPdf({ pages, format, filename = 'editor-lebes', onProgress }) {
  const pageHtmls = pages.map(page =>
    renderToStaticMarkup(createElement(StaticPage, { page, format }))
  );
  const html = buildMultiPageDocument(pageHtmls, format.w, format.h);
  const blob = await fetchWithProgress(`${API_URL}/api/export/pdf`, { html, widthPx: format.w, heightPx: format.h, filename }, onProgress);
  return { blob, filename: `${filename}.pdf` };
}

/**
 * Exporta as páginas informadas como PNGs em resolução nativa (~72 DPI, RGB).
 * Cada página vira um arquivo .png dentro de um .zip.
 */
export async function exportPagesAsPngZip({ pages, format, filename = 'editor-lebes', onProgress }) {
  const blob = await postForZip('/api/export/png', pages, format, filename, onProgress);
  return { blob, filename: `${filename}.zip` };
}

/**
 * Exporta as páginas informadas como PDFs separados, um por página, dentro de um .zip.
 */
export async function exportPagesAsPdfZip({ pages, format, filename = 'editor-lebes', onProgress }) {
  const blob = await postForZip('/api/export/pdf-zip', pages, format, filename, onProgress);
  return { blob, filename: `${filename}.zip` };
}

async function postForZip(endpoint, pages, format, filename, onProgress) {
  const pagePayloads = pages.map(page => ({
    html: buildSinglePageDocument(
      renderToStaticMarkup(createElement(StaticPage, { page, format })),
      format.w,
      format.h,
    ),
  }));
  return fetchWithProgress(`${API_URL}${endpoint}`, { pages: pagePayloads, widthPx: format.w, heightPx: format.h, projectName: filename }, onProgress);
}
